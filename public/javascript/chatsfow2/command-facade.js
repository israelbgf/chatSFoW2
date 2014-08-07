$(function(){

	const COMMANDS = {
	    "!gif": GifnailCommand,
	    "!clear": ClearCommand,
	    "!online": OnlineCommand,
	    "!chat": ChatCommand
	}

	$("#chatForm").on("submit", function(event) {
		var input = $("#inputMessage").val();
		var command = extractCommand(input);
		event.preventDefault();
	    COMMANDS[command].execute(extractArgument(input));	    
	});

	function extractCommand(input) {
		return input.charAt(0) == '!' ? input.split(" ")[0] : '!chat';
	}

	function extractArgument (input) {
		return input.indexOf(" ") > -1 ? input.split(" ")[1] : input;
	}

})
