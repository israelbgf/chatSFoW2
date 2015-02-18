function getUserHomePath(env) {
    var homePath = env.USERPROFILE || env.HOME;
    if(homePath)
        return homePath;
    else
        throw Error("Environment error!");
}

exports.getUserHomePath = getUserHomePath;