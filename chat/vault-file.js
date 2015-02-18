var fs = require("fs");
var path = require('path');
var configuration = require('./configuration');

var USER_HOME = configuration.getUserHomePath(process.env);
var FILE_NAME_PREFIX = ".chatsfow_";
var MAX_VAULT_SIZE = 300;

var vault = {

    fetch : function(userEmail, alias, callback){
        alias = alias || "";
        
    	fs.readFile(getFileLocation(userEmail), function (err, vaultFile) {
    		var vaultItens = [];

    		if(vaultFile)
				vaultFile.toString()
				.split("\n")
				.filter(emptyLines)
				.forEach(function(line){
		            var vaultItem = JSON.parse(line);
		            if (vaultItem.alias != null && vaultItem.alias.indexOf(alias) > -1)
		                vaultItens.push(vaultItem);
		        });

	        callback(null, vaultItens);
		});
    },

    add : function(userEmail, newVaultItem){
        this.fetch(userEmail, newVaultItem.alias, function(err, vaultItems){
            if (vaultItems.length > MAX_VAULT_SIZE) {
	            callback("Maximum vault size reached!");
	        }
	        vaultItems.forEach(function (vaultItem) {
	            if (vaultItem.alias == newVaultItem.alias)
	            	callback("Alias '" + newVaultItem.alias + "' already exists!");
	        });
	        fs.appendFile(getFileLocation(userEmail), JSON.stringify(newVaultItem) + "\n");
        });
    },

    remove : function(userEmail, alias){
    	this.fetch(userEmail, alias, function(err, vaultItems){
	        var updatedVault = vaultItems.filter(function (vaultItem) {
	            return vaultItem.alias != alias;
	        });
	        fs.truncateSync(getFileLocation(userEmail), "");
	        updatedVault.map(function(vaultItem){
	            vault.add(userEmail, vaultItem);
	        });    		
    	});
    }

};

function emptyLines(line) { 
	return line.trim();
}

function getFileLocation(userEmail){
    return path.join(USER_HOME, FILE_NAME_PREFIX + userEmail);
}

module.exports = vault;