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

var chatHistory = require("./apps/chat-history")
var vault = require("./apps/vault")

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
var typingUsers = {};

io.sockets.on('connection', function(socket) {

    var userEmail = getUserForIP();

    if (userEmail) {
        setUser();
    } else {
        socket.disconnect();
        return;
    }

    function setUser() {
        clients.push(userEmail);
        socket.emit('timesync', Date.now());
        socket.emit("setUser", userEmail);
        socket.emit('chatHistoryLoad', chatHistory.load());
        io.sockets.emit('userJoined', userEmail);
    }

    socket.on('disconnect', function() {
        typingUsers[userEmail] = false;
        io.sockets.emit('userIsTyping', typingUsers);
        io.sockets.emit('userDisconnected', userEmail);
        clients.splice(clients.indexOf(userEmail), 1);
    });

    socket.on('usersOnlineRequest', function(){
        var online = [];
        clients.forEach(function(user) {
            var c = {};
            c.userEmail = user;
            c.avatar = gravatar.url(user, {s: '200', r: 'x', d: 'mm'});
            online.push(c);
        });
        socket.emit('usersOnlineResponse', online);
    });

    socket.on('newMessage', function(chatMessage){
        chatMessage.timestamp = Date.now();
        chatMessage.userEmail = userEmail;
        chatMessage.avatar = gravatar.url(chatMessage.userEmail, {s: '200', r: 'x', d: 'mm'});
        chatMessage.messageContent = escapeHTML(chatMessage.messageContent);
        chatHistory.save(chatMessage);
        io.sockets.emit('receiveMessage', chatMessage);
    });

    socket.on('userIsTyping', function(typingEvent){
        typingUsers[typingEvent.userEmail] = typingEvent.isTyping;
        io.sockets.emit('userIsTyping', typingUsers);
    });

    socket.on('addToVault', function(gifnail){
        try {
            vault.add(userEmail, gifnail);
        } catch (err) {
            io.sockets.emit('aliasAlreadyExists', {message:err.message});
        }
    });

    socket.on('removeFromVault', function(gifnail){
        vault.remove(userEmail, gifnail.alias);
    });

    socket.on('fetchFromVault', function(queryParameter){
        io.sockets.emit('fetchFromVault', vault.fetch(userEmail, queryParameter.alias));
    });

    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };

    function replaceTag(tag) {
        return tagsToReplace[tag] || tag;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>]/g, replaceTag);
    }

    function getUserForIP() {
        var clientAddress = socket.request.socket.remoteAddress;
        var userEmail = allowedClients[clientAddress];
        console.log('Client from ' + clientAddress + '(' + userEmail + ') trying to connect...');
        return userEmail;
    }

});

setTimeout(function(){
    io.sockets.emit('serverIsUp');
}, 5000);


module.exports = app;
