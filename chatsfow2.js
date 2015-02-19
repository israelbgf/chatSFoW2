#!/usr/bin/env node
var app = require('./app');
var chat = require('./chat/engine');
var configuration = require('./chat/configuration')
                        .from(process.env, require('./config.json'));

chat.listen(app.listen(configuration.server_port));