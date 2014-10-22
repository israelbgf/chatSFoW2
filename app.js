//core nodejs modules
var http = require('http');
var path = require('path');

//public modules from npm
var express = require('express');
var favicon = require('static-favicon');
var routes = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

module.exports = app;
