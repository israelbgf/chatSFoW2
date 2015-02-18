function getUserHomePath(env) {
    if(env.USERPROFILE)
        return env.USERPROFILE;
    else
        throw("Environment error!");
}

exports.getUserHomePath = getUserHomePath;