#!/usr/bin/env node
var app = require('./app');
var chat = require('./chat/engine.js');

var port = process.env.PORT || 5000; // Use the port that Heroku provides or default to 5000

chat.listen(app.listen(port));
