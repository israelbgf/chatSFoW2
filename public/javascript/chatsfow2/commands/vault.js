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
        selector: 'img[gifnail-vault]',
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

    ChatCommand.on("aliasAlreadyExists", function(error) {
        alert(error.message);
    });

	return {
		execute: function (alias) {
			ChatCommand.emit("fetchFromVault",{alias: alias});
		}
	}
}();