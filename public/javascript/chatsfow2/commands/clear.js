var ClearCommand = {
	execute: function() {
		$("#messagesBox").children().remove();
		$("#inputMessage").val("");
	}
};