var fs = require("fs");
var path = require('path');
var configuration = require('./configuration');

var USER_HOME = configuration.getUserHomePath(process.env)
var FILE_NAME = ".chatsfow_chathistory";
var CHAT_HISTORY_FILE = path.join(USER_HOME, FILE_NAME);


var fileBackend = {

    load : function(){
        var chatHistory = []
        fetchChatHistory().forEach(function(line){
            if(lineHasData(line))
                chatHistory.push(JSON.parse(line));
        });
        return chatHistory;
    },

    save : function(chatMessage){
        fs.appendFile(CHAT_HISTORY_FILE, JSON.stringify(chatMessage) + "\n");
    }

};

function fetchChatHistory(){
    try{
        return fs.readFileSync(CHAT_HISTORY_FILE)
                    .toString().split("\n");
    }catch(err){
        return [];
    }
}

function lineHasData(line){
    return line.trim()
}

module.exports = fileBackend;