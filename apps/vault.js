var fs = require("fs")
var path = require('path')

var USER_HOME = process.env.HOME || process.env.HOMEPATH;
var FILE_NAME_PREFIX = ".chatsfow_";

var vault = {

    fetch : function(userEmail){
        var vaultItens = []
        fetchVaultItems(userEmail).forEach(function(line){
            if(isLineNotEmpty(line))
                vaultItens.push(JSON.parse(line));
        });
        return vaultItens;
    },

    add : function(userEmail, item){
        fs.appendFile(getFileLocation(userEmail), JSON.stringify(item) + "\n");
    },

    remove : function(userEmail, alias){
        var updatedVault = this.fetch(userEmail).filter(function (vaultItem) {
            return vaultItem.alias != alias;
        });
        fs.truncateSync(getFileLocation(userEmail), "");
        updatedVault.map(function(vaultItem){
            vault.add(userEmail, vaultItem);
        });

    }

};

function getFileLocation(userEmail){
    return path.join(USER_HOME, FILE_NAME_PREFIX + userEmail);
}

function fetchVaultItems(userEmail){
    try{
        return fs.readFileSync(getFileLocation(userEmail))
                    .toString().split("\n");
    }catch(err){
        return [];
    }
}

function isLineNotEmpty(line){
    return line.trim()
}

module.exports = vault;