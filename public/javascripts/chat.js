function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a tooltip href="$1" target="_blank">$1</a>');
}

$(function () {

    var serverHost = prompt("Tell me the server address to start rocking!") || 'localhost';
    var userEmail = prompt("Now tell me you e-mail bro (we use it for Gravatar images)!") || 'noob@vacilao.com';
    var connection = io.connect('http://' + serverHost + ':1337');

    $("#inputMessage").focus();

    connection.on('connect', function() {
        console.log('newMessage', userEmail + " has entered the peleja.");
    });

    connection.on('receiveMessage', function (data) {
        $('#messagesBox').append("<p><b>(" +
                                data.timestamp + ") " +
                                "<span avatar data-img='" + data.avatar + "'>" + data.userEmail + "</span></b>: " +
                                urlify(data.messageContent) + "</p>");
        var domElement = document.getElementById("messagesBox");
        domElement.scrollTop = domElement.scrollHeight + 30;
    });

    $( document ).tooltip({
        items: "[tooltip], [avatar]",
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

    $("#inputButton").click(function(event){
        connection.emit('newMessage', {
            messageContent: $("#inputMessage").val(),
            userEmail: userEmail
        });
        $("#inputMessage").val("").focus();
    });

    $("#inputMessage").keyup(function(event){
        if(event.keyCode == 13){
            $("#inputButton").click()
        }
    });

    function isImage(url) {
        return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }

});