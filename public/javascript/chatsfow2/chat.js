var ChatCommand = function(){

    var connection, userEmail;
    var $inputMessage = $("#inputMessage");
    var $messageBox = $('#messagesBox');
    var timeDifferenceFromServer;

    setupIsTypingListener();
    setupTimestampsVisualEffect();

    function setupTimestampsVisualEffect() {
        $("#messagesBox").hoverIntent({
           over: function(event){
               var timestampLabel = getTimestampLabel(event);
               timestampLabel.text(getFormattedTimeStamp(timestampLabel.data("timestamp")));
               timestampLabel.fadeIn(500);
           },
           out: function(event){
               var timestampLabel = getTimestampLabel(event);
               timestampLabel.fadeOut(500);
           },
           selector: ".chatMessage",
           timeout: 500
        });
    }

    function setupIsTypingListener() {
        $("#inputMessage").keyup(function(){
            var isTyping = $(this).val().length > 0;
            connection.emit("userIsTyping", {
                userEmail: userEmail,
                isTyping: isTyping
            });
        });
    }

    function getTimestampLabel(event) {
        return $(event.target).closest(".chatMessage").children().last();
    }

    function getFormattedTimeStamp(timestamp) {
        var messageDate = new Date(Number.parseInt(timestamp+timeDifferenceFromServer));
        return " (" + moment(messageDate).fromNow() + ")";
    }

    return {

        init: function(serverAddress){
            $inputMessage.focus();
            connection = io.connect('http://' + serverAddress + ':1337');

            connection.on('setUser', function(remoteUserEmail) {
                userEmail = remoteUserEmail;
            });

            connection.on('timesync', function(data) {
                timeDifferenceFromServer = Date.now() - data;
            });

            connection.on('userIsTyping', function(typingEvent) {
                $usersTypingDiv = $("#usersTyping");

                $usersTypingDiv.children().remove();
                for(var user in typingEvent){
                    if(userEmail.split("@")[0] == user.split("@")[0])
                        continue;
                    if(typingEvent[user])
                        $("<span>").text(user.split("@")[0])
                            .appendTo($usersTypingDiv);
                }

            });

            connection.on('serverIsUp', function(){
                window.location.reload();
            });

            var hasNotAlreadyFetchedHistory = true;
            connection.on('chatHistoryLoad', function(chatMessages) {
                if(hasNotAlreadyFetchedHistory){
                    chatMessages.forEach(function(chatMessage){
                        addMessageToChatBox(chatMessage);
                    });
                    hasNotAlreadyFetchedHistory = false;
                }
            });

            connection.on('userJoined', function(user) {
                toastr.options.timeOut = 2000;
                toastr.info("A wild <b>" + stripEmail(user) + "</b> appears!");
            });

            connection.on('userDisconnected', function(user) {
                toastr.options.timeOut = 2000;
                toastr.warning("Our fellow <b>" + stripEmail(user) + "</b> fled!");
            });

            connection.on('receiveMessage', addMessageToChatBox);

            $(document).tooltip({
                items: "[tooltip], [avatar]",
                position: {
                    my: "center bottom-25",
                    at: "center top",
                    collision: "flipfit flip",
                    using: function( position, feedback ) {
                        $(this).css( position );
                        $("<div>")
                            .addClass( "ui-tooltip-arrow" )
                            .addClass( feedback.vertical )
                            .addClass( feedback.horizontal )
                            .appendTo( this );
                    }
                },
                content: function() {
                    var element = $( this );
                    if (element.is("[tooltip]")) {
                        var url = $(this).attr("href")
                        return isImage(url) ? "<img src='" + url + "'>" : false;
                    } else {
                        var url = $(this).attr("data-img")
                        return "<img src='" + url + "'>";
                    }
                }
            });

            function stripEmail(email) {
                return email.split("@")[0];
            }

            function isImage(url) {
                return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
            }

            function urlify(text) {
                var urlRegex = /(https?:\/\/[^\s]+)/g;
                return text.replace(urlRegex, function(match, url) {
                    var tooltip = isImage(url) ? "tooltip" : "";
                    return '<a ' + tooltip + ' href="' + url + '" target="_blank">' + url + '</a>';
                });
            }

            function addMessageToChatBox(data){
                ChatCommand.scrollToBottom();

                var messageContent = data.messageContent;
                if (data.isCode)
                    messageContent = "<pre>" + messageContent + "</pre>";

                var processedMessage = '<p class="chatMessage';
                if (data.userEmail == userEmail) {
                    processedMessage += ' myMessage';
                }
                processedMessage += '">' + urlify(messageContent);
                processedMessage += "<span class='timestamp' data-timestamp='" + data.timestamp + "'></span></p>";

                var lastMessage = $(".messageBlock").last();
                if (lastMessage.find('.messageEmail').text() == data.userEmail.split("@")[0]) {
                    $(".messageBlock").last().find('.message').append(processedMessage);
                } else {
                    $('<div class="messageBlock">'
                        + '<div class="messagePhoto">'
                          + '<img class="imgAvatar" src="'+data.avatar+'" />'
                        + '</div>'
                        + '<div class="message">'
                          + '<h3 class="messageEmail">' + data.userEmail.split("@")[0] + '</h3>'
                          + processedMessage
                        + '</div>'
                    + '</div>').appendTo($messageBox);
                }

                if (data.isCode)
                    hljs.highlightBlock($("pre").last()[0]);

                if(data.userEmail != userEmail){
                    $.titleAlert("New chat message!", {
                        stopOnFocus: true,
                        requireBlur: true
                    });
                }
            };

        },

        execute: function(chatMessage) {
            var message = removeHTMLTags(chatMessage);
            if (message.trim() > "" ) {
                connection.emit('newMessage', {
                    messageContent: message
                });
                $inputMessage.val("").focus();
            }
        },

        scrollToBottom: function () {
            var scrollHeight = $messageBox.prop("scrollHeight");
            var outerHeight = $messageBox.scrollTop() + $messageBox.outerHeight();
            if (scrollHeight - outerHeight < 20) {
                setTimeout(function() {$messageBox.scrollTop($messageBox.prop("scrollHeight"))}, 100);
            }
        },

        on: function (event, callback) {
            connection.on(event, callback);
        },

        emit: function (event, callback) {
            connection.emit(event, callback);
        },

        getUserEmail: function () {
            return userEmail;
        }
    }

    function removeHTMLTags(text) {
        var regex = /(<([^>]+)>)/ig
        return text.replace(regex, "").replace(/(&nbsp)*/g,"");
    }

}();
