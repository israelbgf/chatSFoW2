function getUserHomePath(env) {
    var userHomePath = env.USERPROFILE || env.HOME;
    if(userHomePath)
        return userHomePath;
    else
        throw Error("Environment error!");
}

function getConfig(env) {
    return env;
}
exports.getUserHomePath = getUserHomePath;
exports.getConfig = getConfig;