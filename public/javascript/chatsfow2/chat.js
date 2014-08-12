var ChatCommand = function(){

    var connection, userEmail;
    var $inputMessage = $("#inputMessage");
    var $messageBox = $('#messagesBox');

    return {

        init: function(serverAddress, restrictedMode){
            userEmail = restrictedMode || prompt("Now tell me you e-mail bro (we use it for Gravatar images)!", "dude'o");
            connection = io.connect('http://' + serverAddress + ':1337');

            $inputMessage.focus();

            connection.on('forceClientEmail', function(data) {
                userEmail = data.email;
                connection.emit("message", {userEmail: userEmail});
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
                ChatCommand.scrollToBottom();
                var html = "<div class='joined'>";
                html += "<b>(" + user + ")</b>";
                html += " entered the room.</div>";
                $("#messagesBox").append(html);
            });

            connection.on('userDisconnected', function(user) {
                ChatCommand.scrollToBottom();
                var html = "<div class='exited'>";
                html += "<b>(" + user + ")</b>";
                html += " exited the room.</div>";
                $("#messagesBox").append(html);
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

            function isImage(url) {
                return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
            }

            function urlify(text) {
                var urlRegex = /(https?:\/\/[^\s]+)/g;
                return text.replace(urlRegex, '<a tooltip href="$1" target="_blank">$1</a>');
            }

            function addMessageToChatBox(data){
                ChatCommand.scrollToBottom();

                var messageContent = data.messageContent;
                if (data.isCode)
                    messageContent = "<pre>" + messageContent + "</pre>";

                var processedMessage = '<p>' + urlify(messageContent) + '</p>';

                var lastMessage = $(".messageBlock").last();
                if (lastMessage.find('.messageEmail').text() == data.userEmail) {
                    $(".messageBlock").last().find('.message').append(processedMessage);
                } else {
                    $('<div class="messageBlock">'
                    + '<div class="messagePhoto">'
                    + '<img class="imgAvatar" src="'+data.avatar+'" />'
                    + '</div>'
                    + '<div class="message">'
                    + '<h3 class="messageEmail">' + data.userEmail + '</h3>'
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
                    messageContent: message,
                    userEmail: userEmail
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