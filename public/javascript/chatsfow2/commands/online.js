var OnlineCommand = function() {

    ChatCommand.on('usersOnlineResponse', function(clients) {
        ChatCommand.scrollToBottom();
        var html = "<div class='usersOnline'><b>Users online:</b><ul class='usersOnline'>";
        $.each(clients, function(i, client) {
            html += "<li>";
            html += "<span avatar data-img='" + client.avatar + "'>";
            html += client.userEmail;
            html += "</span></li>";
        });
        html += "</ul></div>";
        $("#messagesBox").append(html);
        $("#inputMessage").val("");
    });

	return {
		execute: function () {
			ChatCommand.emit("usersOnlineRequest", {});
		}
	}
}();