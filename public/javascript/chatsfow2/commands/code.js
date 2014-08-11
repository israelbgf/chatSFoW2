var CodeCommand = function() {

    var $inputMessage = $("#inputMessage");

    ChatCommand.on("receiveMessage", function (chatMessage) {
        if (chatMessage.isCode){
            var lastMessageDOM = $(".messageBlock .message p").last()[0];
            hljs.highlightBlock(lastMessageDOM);
        }
    });

    return {
		execute: function (code) {
            if (code.trim() > "" ) {
                ChatCommand.emit('newMessage', {
                    messageContent: code,
                    userEmail: ChatCommand.getUserEmail(),
                    isCode: true
                });
                $inputMessage.val("").focus();
            }
		}
	}
}();