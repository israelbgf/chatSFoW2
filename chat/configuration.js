function getUserHomePath(env) {
    var userHomePath = env.USERPROFILE || env.HOME;
    if(userHomePath)
        return userHomePath;
    else
        throw Error("Environment error!");
}

exports.getUserHomePath = getUserHomePath;