var fs = require("fs")
var path = require('path')

var USER_HOME = process.env.HOME || process.env.HOMEPATH;
var FILE_NAME_PREFIX = ".chatsfow_";

var vault = {

    fetch : function(userEmail, alias){
        alias = alias || "";
        var vaultItens = [];
        fetchVaultItems(userEmail).forEach(function(line){
            var vaultItem = JSON.parse(line);
            if (vaultItem.alias.indexOf(alias) > -1)
                vaultItens.push(vaultItem);
        });
        return vaultItens;
    },

    add : function(userEmail, newVaultItem){
        var vaultItems = this.fetch(userEmail)
        if (vaultItems.length > 50) {
            throw new Error("Maximum vault size reached!");
        }
        vaultItems.forEach(function (vaultItem) {
            if (vaultItem.alias == newVaultItem.alias)
                throw new Error("Alias '" + newVaultItem.alias + "' already exists!");
        });
        fs.appendFile(getFileLocation(userEmail), JSON.stringify(newVaultItem) + "\n");
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
                    .toString().split("\n")
                    .filter(function(line){ return line.trim() });
    }catch(err){
        return [];
    }
}

module.exports = vault;