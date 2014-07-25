function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a tooltip href="$1" target="_blank">$1</a>');
}

$(function () {

    const DEFAULT_HOST = 'localhost';
    const DEFAULT_EMAIL = 'noob@vacilao.com';

    var serverHost = prompt("Tell me the server address to start rocking!") || DEFAULT_HOST;
    var userEmail = prompt("Now tell me you e-mail bro (we use it for Gravatar images)!") || DEFAULT_EMAIL;
    var connection = io.connect('http://' + serverHost + ':1337');

    $("#inputMessage").focus();

    connection.on('connect', function() {
        console.log('newMessage', userEmail + " has entered the peleja.");
        this.send({userEmail: userEmail});
    });

    connection.on('ipAddressLoopback', function(data) {
        console.log(data.address);
        if(data.address == '127.0.0.1'){
//            userEmail = "";
        }
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
            messageContent: $("#inputMessage").val()
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