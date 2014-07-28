function init(serverAddress, restrictedMode){

    var inputMessage = $("#inputMessage");
    $form = $('#chatForm'),
    userEmail = restrictedMode || prompt("Now tell me you e-mail bro (we use it for Gravatar images)!", "dude'o"),
    connection = io.connect('http://' + serverAddress + ':1337');

    $("#inputMessage").focus();

    connection.on('forceClientEmail', function(data) {
        userEmail = data.email;
        this.send({userEmail: userEmail});
    });

    connection.on('disconnect', function(data) {
        
    });

    connection.on('userJoined', function(user) {
        var html = "<p class='joined'>";
        html += "<b>(" + user + ")</b>";
        html += " entered the room.</p>";
        $("#messagesBox").append(html);
    });
    
    connection.on('userDisconnected', function(user) {
        var html = "<p class='exited'>";
        html += "<b>(" + user + ")</b>";
        html += " exited the room.</p>";
        $("#messagesBox").append(html);
    });
    
    connection.on('usersOnline', function(clients) {
        var html = "<p class='usersOnline'><b>Users online:</b></p><ul class='usersOnline'>";
        $.each(clients, function(i, client) {
            html += "<li>";
            html += "<span avatar data-img='" + client.avatar + "'>";
            html += client.userEmail;
            html += "</span></li>";
        });
        html += "<p></p></ul>";
        $("#messagesBox").append(html);
    });
    
    connection.on('receiveMessage', function (data) {
        $('#messagesBox').append("<p><b>(" +
            data.timestamp + ") " +
            "<span avatar data-img='" + data.avatar + "'>" + data.userEmail + "</span></b>: " +
            urlify(data.messageContent) + "</p>");

        var $box = $('#messagesBox');
        $box.scrollTop($box.prop("scrollHeight"));
        if (data.userEmail != userEmail){
            $.titleAlert("New chat message!", {
                stopOnFocus:true,
                requireBlur:true
            });    
        }
    });
    
    $( document ).tooltip({
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

    $form.submit(function(ev) {
       ev.preventDefault();
        var message = removeHTMLTags(inputMessage.val());
        if (message.trim() > "" ) {
            connection.emit('newMessage', {
                messageContent: message,
                userEmail: userEmail
            });
            inputMessage.val("").focus();
        }
    });

    function removeHTMLTags(text) {
        var regex = /(<([^>]+)>)/ig
        return text.replace(regex, "").replace(/(&nbsp)*/g,"");
    }

    function isImage(url) {
        return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }

    function urlify(text) {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, '<a tooltip href="$1" target="_blank">$1</a>');
    }

}
