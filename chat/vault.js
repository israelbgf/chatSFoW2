if (process.argv[2] == "mongodb"){
    module.exports = require("./vault-mongodb");
} else {
    module.exports = require("./vault-file");
}