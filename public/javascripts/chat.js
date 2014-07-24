function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a tooltip href="$1">$1</a>');
}

$(function () {

    var serverHost = prompt("Tell me the server address to start rocking!") || 'localhost';
    var userEmail = prompt("Now tell me you e-mail bro (we use it for Gravatar images)!") || 'noob@vacilao.com';
    var connection = io.connect('http://' + serverHost + ':1337');

    connection.on('connect', function() {
        console.log('newMessage', userEmail + " has entered the peleja.");
    });

    connection.on('receiveMessage', function (data) {
        $('#messagesBox').append("<p><b>" + data.userEmail + "</b>: " + urlify(data.messageContent) + "</p>");
    });

    $("#inputButton").click(function(event){
        connection.emit('newMessage', {
            messageContent: $("#inputMessage").val(),
            userEmail: userEmail
        });
    });

    $( document ).tooltip({
        items: "[tooltip]",
        content: function() {
            var url = $(this).attr("href")
            return isImage(url) ? "<img src='" + url + "'>" : false;
        }
    });

    $("#inputMessage").keyup(function(event){
        if(event.keyCode == 13){
            $("#inputButton").click();
            $(event.target).val("");
        }
    });

    function isImage(url) {
        return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }

});