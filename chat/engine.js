var socket = require('socket.io')
var gravatar = require('gravatar');

var allowedClients = require("../allowed_clients.json")
var chatHistory = require("./history")
var vault = require("./vault")

function listen(connection){
    var io = socket.listen(connection)
    var clients = [];
    var typingUsers = {};
    
    var poll = pollReset();

    io.sockets.on('connection', function(socket) {

        var userEmail = getUserForIP();

        if (userEmail) {
            setUser();
        } else {
            socket.disconnect();
            return;
        }

        function setUser() {
            clients.push(userEmail);
            socket.emit('timesync', Date.now());
            socket.emit("setUser", userEmail);
            socket.emit('chatHistoryLoad', chatHistory.load());
            io.sockets.emit('userJoined', userEmail);
        }

        if(poll.isActive && !poll.votes[userEmail])
            socket.emit('pollRequest', poll);

        setTimeout(function(){socket.emit('pollRefresh', poll)}, 1500);

        socket.on('disconnect', function() {
            typingUsers[userEmail] = false;
            io.sockets.emit('userIsTyping', typingUsers);
            io.sockets.emit('userDisconnected', userEmail);
            clients.splice(clients.indexOf(userEmail), 1);
        });

        socket.on('usersOnlineRequest', function(){
            var online = [];
            clients.forEach(function(user) {
                var c = {};
                c.userEmail = user;
                c.avatar = gravatar.url(user, {s: '200', r: 'x', d: 'mm'});
                online.push(c);
            });
            socket.emit('usersOnlineResponse', online);
        });

        socket.on('newMessage', function(chatMessage){
            chatMessage.timestamp = Date.now();
            chatMessage.userEmail = userEmail;
            chatMessage.avatar = gravatar.url(chatMessage.userEmail, {s: '200', r: 'x', d: 'mm'});
            chatMessage.messageContent = escapeHTML(chatMessage.messageContent);
            chatHistory.save(chatMessage);
            io.sockets.emit('receiveMessage', chatMessage);
        });

        socket.on('userIsTyping', function(typingEvent){
            typingUsers[typingEvent.userEmail] = typingEvent.isTyping;
            io.sockets.emit('userIsTyping', typingUsers);
        });

        socket.on('addToVault', function(gifnail){
            try {
                vault.add(userEmail, gifnail);
            } catch (err) {
                socket.emit('aliasAlreadyExists', {message:err.message});
            }
        });

        socket.on('removeFromVault', function(gifnail){
            vault.remove(userEmail, gifnail.alias);
        });

        socket.on('fetchFromVault', function(queryParameter){
            socket.emit('fetchFromVault', vault.fetch(userEmail, queryParameter.alias));
        });

        socket.on('damage', function(source){
            io.sockets.emit('damage', {target: userEmail, source: removeHTMLTags(source)});
        });

        socket.on('pollRequest', function(pollRequest) {
            if (poll.isActive)
                socket.emit('pollbrema', "Poll is already running, fera.");
            else {
                poll = {};
                poll.question = pollRequest.question;
                poll.options = pollRequest.options;
                poll.owner = userEmail;
                poll.votes = {};
                poll.isActive = true;
                io.sockets.emit('pollRequest', poll);
            }
        });

        socket.on('pollAnswer', function(answer) {
            answer = parseInt(answer);
            if (isNaN(answer) || (answer > 4 || answer < 1))
                answer = "NULO";
            else
                answer = poll.options[answer - 1].description;

            poll.votes[userEmail] = {
                gravatar: gravatar.url(userEmail, {s: '32', r: 'x', d: 'mm'}),
                answer: answer
            };
            io.sockets.emit('pollRefresh', poll);
        });

        socket.on('pollClose', function() {
            if (poll.owner == userEmail) {
                var pollResult = {
                    question: poll.question,
                    votes: countVotes(poll.votes)
                };
                poll = pollReset();
                io.sockets.emit("pollClose", pollResult);
                io.sockets.emit('pollRefresh', poll);
            } else
                socket.emit('pollbrema', "The poll is not yours, fera.");
        });

        var tagsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };

        function replaceTag(tag) {
            return tagsToReplace[tag] || tag;
        }

        function escapeHTML(str) {
            return str.replace(/[&<>]/g, replaceTag);
        }

        function removeHTMLTags(text) {
            var regex = /(<([^>]+)>)/ig;
            return text.replace(regex, "").replace(/(&nbsp)*/g,"");
        }

        function getUserForIP() {
            var clientAddress = socket.request.socket.remoteAddress;
            var userEmail = allowedClients[clientAddress];
            console.log('Client from ' + clientAddress + '(' + userEmail + ') trying to connect...');
            return userEmail;
        }

    });

    setTimeout(function(){
        io.sockets.emit('serverIsUp');
    }, 1000);
}

function countVotes(votes) {
    var result = {};
    for(var user in votes) {
        var answer = votes[user].answer;
        if (result[answer])
            result[answer] = result[answer] + 1;
        else 
            result[answer] = 1;
    }

    return result;
}

function pollReset() {
    return {
        question : "",
        options: [
            {description: ''},
            {description: ''},
            {description: ''},
            {description: ''}
        ],
        votes: []
    };
}

exports.countVotes = countVotes;
exports.listen = listen;