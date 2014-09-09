var fs = require("fs")
var path = require('path')

var USER_HOME = process.env.HOME || process.env.HOMEPATH;
var FILE_NAME_PREFIX = ".chatsfow_";

var vault = {

    fetch : function(userEmail){
        var vaultItens = []
        fetchVaultItens(userEmail).forEach(function(line){
            if(lineHasData(line))
                vaultItens.push(JSON.parse(line));
        });
        return vaultItens;
    },

    add : function(userEmail, item){
        fs.appendFile(getFileLocation(userEmail), JSON.stringify(item) + "\n");
    }

};

function getFileLocation(userEmail){
    return path.join(USER_HOME, FILE_NAME_PREFIX + userEmail);
}

function fetchVaultItens(userEmail){
    try{
        return fs.readFileSync(getFileLocation(userEmail))
                    .toString().split("\n");
    }catch(err){
        return [];
    }
}

function lineHasData(line){
    return line.trim()
}

module.exports = vault;