var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./routes/index');
var users = require('./routes/users');
var allowedClients = require("./allowed_clients")

var app = express();

var gravatar = require('gravatar');

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
var io = socket.listen(app.listen(1337))
var restrictedClientsModeEnabled = process.argv[2];

io.sockets.on('connection', function(socket) {

    if(restrictedClientsModeEnabled)
        checkForClientRestriction(socket);

    socket.on('newMessage', function(data){
        var timestamp = new Date();
        data.timestamp = timestamp.getHours() + ":" +
                         timestamp.getMinutes() + ":" +
                         timestamp.getSeconds();

        data.avatar = gravatar.url(data.userEmail, {s: '200', r: 'x', d: 'mm'});

        io.sockets.emit('receiveMessage', data);
    });
});

function checkForClientRestriction(socket) {

    var clientAddress = socket.handshake.address;
    var allowedClient = allowedClients[clientAddress.address];

    console.log('Client from ' + clientAddress.address + ' connected...');
    if(allowedClient)
        socket.emit('forceClientEmail', {
            email: allowedClient
        });
    else
        socket.disconnect();

}


module.exports = app;
