#!/usr/bin/env node
var app = require('./app');
var chat = require('./chat/engine');
var config = require('./config')

var port = process.env.PORT || config.server_port; // Use the port that Heroku provides or default to 5000

chat.listen(app.listen(port));