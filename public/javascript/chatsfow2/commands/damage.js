var DamageCommand = function() {

    ChatCommand.on('damage', function(damage) {
        if (ChatCommand.getUserEmail() == damage.source)
            toastr.success("You have damaged <b> " + stripEmail(damage.target) + "</b>");
        else
            toastr.error("<b>" + stripEmail(damage.target) + "</b> has taken damage from <b>" + stripEmail(damage.source) + "</b>");
    });

    ChatCommand.on('calmDown', function(){
        toastr.warning("Calm down Fera. Tais exaltado, pensa bem.");
    });

    function stripEmail(email) {
        return email.split("@")[0];
    }

	return {
		execute: function (user) {
			ChatCommand.emit("damage", user);
		}
	}

}();