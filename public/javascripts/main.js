$(function(){

	const COMMANDS = {
	    "!gif": GifnailCommand,
	    "!clear": ClearCommand,
	    "!online": OnlineCommand,
	    "!chat": ChatCommand
	}

	$("#chatForm").on("submit", function(event) {
		var input = $("#inputMessage").val();
	    COMMANDS[findCommand(input)].execute(findData(input));
	    event.preventDefault();
	});

	function findCommand(input) {
		return input.charAt(0) == '!' ? input.split(" ")[0] : '!chat';
	}

	function findData (input) {
		return input.split(" ")[1];
	}

})
