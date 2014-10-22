#!/usr/bin/env node
var app = require('./app');
var chat = require('./chat/engine.js');

app.listen(process.env.PORT || 3000);
chat.listen(app.listen(1337));
