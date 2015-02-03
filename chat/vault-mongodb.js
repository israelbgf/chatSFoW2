var MongoClient = require('mongodb').MongoClient

var URL = 'mongodb://chatsfowdb:chatsfowdb@ds053638.mongolab.com:53638/heroku_app33403746';
MongoClient.connect(URL, createMongoVault);

function createMongoVault(err, dbQueVem) {
	console.log("Connecting to the fricking vaults...");
	db = dbQueVem;
};

module.exports = {

    fetch : function(userEmail, alias, callback){
        var query = {};
        if (alias)
        	query = {"alias": RegExp(alias)};

		getCollectionFor(userEmail).find(query).toArray(callback);      
    },

    add : function(userEmail, newVaultItem){
    	getCollectionFor(userEmail).insert(newVaultItem, function(err, result){});
    },

    remove : function(userEmail, alias){
    	getCollectionFor(userEmail).remove({alias:alias}, function(err, result){});
    }
}

function getCollectionFor(userEmail){
	var userCollection = userEmail.replace('@','-');
	return db.collection(userCollection);
}