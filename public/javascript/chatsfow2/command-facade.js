$(function(){

	const COMMANDS = {
		"!boss": BossCommand,
	    "!gif": GifnailCommand,
	    "!clear": ClearCommand,
	    "!online": OnlineCommand,
        "!code": CodeCommand,
        "!vault": VaultCommand,
        "!dmg": DamageCommand,
        "!chat": ChatCommand
    }

	$("#chatForm").on("submit", function(event) {
		var $input = $("#inputMessage");
		var command = extractCommand($input.val());
		event.preventDefault();
	    COMMANDS[command].execute(extractArgument($input.val()));
	    $input.val("");
	});

	function extractCommand(input) {
		return input.charAt(0) == '!' ? input.split(" ")[0] : '!chat';
	}

	function extractArgument (input) {
		if (input.charAt(0) == "!")
			return input.indexOf(" ") > -1 ? input.substr(input.indexOf(" ")).trim() : "";
		else
			return input;
	}

})
