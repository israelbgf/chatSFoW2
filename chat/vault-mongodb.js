var MongoClient = require('mongodb').MongoClient
var config = require("../config.json");
var URL = buildMongoDBConnectionURL();
MongoClient.connect(URL, createMongoVault);

function buildMongoDBConnectionURL() {
    var vault = config.vault;
    return "mongodb://" + vault.user + ":" + vault.password + "@" + vault.host + ":" + vault.database_port + "/" + vault.database_name;
}

function createMongoVault(err, database) {
    console.log("Connecting to the fricking vaults...");
    db = database;
};

module.exports = {

    fetch : function(userEmail, alias, callback){
        var query = {};
        if (alias)
        	query = {"alias": RegExp(alias)};

		getCollectionFor(userEmail).find(query).toArray(callback);      
    },

    add : function(userEmail, newVaultItem, callback){
    	getCollectionFor(userEmail).insert(newVaultItem, callback);
    },

    remove : function(userEmail, alias, callback){
    	getCollectionFor(userEmail).remove({alias:alias}, callback);
    }
}

function getCollectionFor(userEmail){
	var userCollection = userEmail.replace('@','-');
	return db.collection(userCollection);
}