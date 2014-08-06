//core nodejs modules
var http = require('http');
var path = require('path');

//public modules from npm
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var favicon = require('static-favicon');

var bodyParser = require('body-parser');
var gravatar = require('gravatar');
var routes = require('./routes/index');
var users = require('./routes/users');
var chatHistory = require("./apps/chat-history")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Socket IO
var socket = require('socket.io')

var allowedClients = require("./allowed_clients.json")
var io = socket.listen(app.listen(1337))
var restrictedClientsModeEnabled = process.argv[2];
var clients = [];

io.sockets.on('connection', function(socket) {

    if(restrictedClientsModeEnabled)
        checkForClientRestriction(socket);

    var userEmail;
    socket.on('message', function(message){
        userEmail = message.userEmail;
        clients.push(userEmail);
        io.sockets.emit('userJoined', userEmail);
        socket.emit('chatHistoryLoad', chatHistory.load())
    });
    
    socket.on('disconnect', function() {
        io.sockets.emit('userDisconnected', userEmail); 
        clients.splice(clients.indexOf(userEmail), 1);
    });
    
    socket.on('newMessage', function(chatMessage){
        if (chatMessage.messageContent == '!online') {

            var online = [];
            clients.forEach(function(user) {
                var c = {};
                c.userEmail = user;
                c.avatar = gravatar.url(user, {s: '200', r: 'x', d: 'mm'});
                online.push(c);
            });
            socket.emit('usersOnline', online);
            
        } else {
            
            var timestamp = new Date();
            chatMessage.timestamp = timestamp.getHours() + ":" +
                         timestamp.getMinutes() + ":" +
                         timestamp.getSeconds();

            chatMessage.avatar = gravatar.url(chatMessage.userEmail, {s: '200', r: 'x', d: 'mm'});
            chatMessage.messageContent = removeHTMLTags(chatMessage.messageContent);

            chatHistory.save(chatMessage);
            io.sockets.emit('receiveMessage', chatMessage);
            
        }
    });
});

function removeHTMLTags(text) {
    var regex = /(<([^>]+)>)/ig
    return text.replace(regex, "").replace(/(&nbsp)*/g,"");
}

function checkForClientRestriction(socket) {

    var clientAddress = socket.request.socket.remoteAddress;
    var allowedClient = allowedClients[clientAddress];

    console.log('Client from ' + clientAddress + '(' + allowedClient + ') connected...');

    if(allowedClient)
        socket.emit('forceClientEmail', {
            email: allowedClient
        });
    else
        socket.disconnect();

}


module.exports = app;
