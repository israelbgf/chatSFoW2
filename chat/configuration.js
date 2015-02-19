function getUserHomePath(env) {
    var userHomePath = env.USERPROFILE || env.HOME;
    if(userHomePath)
        return userHomePath;
    else
        throw Error("Environment error!");
}

function from(env, app) {
    var config;
    if (env.CHATSFOW_PORT)
        config = getEnvironmentConfig(env);
    else
        config = app;
    return config;
}

function getEnvironmentConfig(env) {
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
exports.from = from;