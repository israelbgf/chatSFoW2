var VaultCommand = function() {

    $.contextMenu({
        selector: 'a[tooltip]', 
        callback: function(key, options) {
            ChatCommand.emit("addToVault", {
                url : this.attr("href"),
                alias: prompt("Choose your destiny (alias):")
            });
        },
        items: {
            "add": {name: "Add to Vault"}
        }
    });

    $.contextMenu({
        selector: 'img.vaultnail',
        callback: function(key, options) {
            if(confirm("Are you sure fera?")){
                ChatCommand.emit("removeFromVault", {
                    alias: this.attr("title")
                });
                this.remove();
            }
        },
        items: {
            "remove": {name: "Remove"}
        }
    });

    ChatCommand.on("fetchFromVault", function(vaultItems) {
        GifnailPresenter.show(VaultProvider.create(vaultItems));
    });

    function isGifnail(text) {
        return text.match(/(https?:\/\/[^\s]+)\.(:?jpeg|jpg|gif|png)/g)
    };

	return {

        execute: function (argument) {
            if (isGifnail(argument))
                ChatCommand.emit("addToVault", {
                    url : argument,
                    alias: prompt("Choose your destiny (alias):")
                });
            else
			    ChatCommand.emit("fetchFromVault",{alias: argument});
		}
	}
}();