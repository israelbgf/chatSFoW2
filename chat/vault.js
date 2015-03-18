var configuration = require('./configuration')
var file = require('../config.json');
var environment = process.env;


var config = configuration.from(environment, file);
if (config.persistence.provider == config.MONGODB){
    console.log('Using mongo-vaults...');
    module.exports = require("./vault-mongodb");
} else {
    console.log('Using file-vaults...');
    module.exports = require("./vault-file");
}