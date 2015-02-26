function getUserHomePath(env) {
    var userHomePath = env.USERPROFILE || env.HOME;
    if(userHomePath)
        return userHomePath;
    else
        throw Error("Environment error!");
}

function from(env, app) {
    env = getNormalizedEnvironmentConfig(env);
    return {
        server_port: getPrioritaryConfig('server_port', env, app),
        persistence: {
            provider: getPrioritaryConfig('persistence.provider', env, app),
            host: getPrioritaryConfig('persistence.host', env, app),
            user: getPrioritaryConfig('persistence.user', env, app),
            password: getPrioritaryConfig('persistence.password', env, app),
            database_name: getPrioritaryConfig('persistence.database_name', env, app),
            database_port: getPrioritaryConfig('persistence.database_port', env, app)
        }
    }
}

function getPrioritaryConfig(property, env, app) {
    if (property.indexOf('.') > -1) {
        return extractNestedPrioritaryProperty(property, env, app)
    } else {
        return env[property] || app[property];
    }
}

function extractNestedPrioritaryProperty(property, env, app){
    var parentProperty = property.split('.')[0];
    var childProperty = property.split('.')[1];

    var contexts = [env, app];
    for(var i=0; i < contexts.length; i++){
        var config = contexts[i][parentProperty];
        if(config && config[childProperty])
            return config[childProperty]
    }
}

function getNormalizedEnvironmentConfig(env) {
    return {
        server_port: env.CHATSFOW_PORT,
        persistence: {
            provider: env.CHASTSFOW_PROVIDER,
            host: env.CHATSFOW_DB_HOST,
            user: env.CHATSFOW_DB_USER,
            password: env.CHATSFOW_DB_PASSWORD,
            database_name: env.CHATSFOW_DB_NAME,
            database_port: env.CHATSFOW_DB_PORT
        }
    }
}

exports.getUserHomePath = getUserHomePath;
exports.getPrioritaryConfig = getPrioritaryConfig;
exports.from = from;

exports.FILE = "file";
exports.MONGODB = "mongodb";
