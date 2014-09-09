var fs = require("fs")
var path = require('path')

var USER_HOME = process.env.HOME || process.env.HOMEPATH;
var FILE_NAME = ".chatsfow_";
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

    add : function(userEmail, item){
        fs.appendFile(path.join(USER_HOME, FILE_NAME + userEmail), JSON.stringify(item) + "\n");
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