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

    ChatCommand.on("fetchFromVault", function(vaultItens) {
        console.log(vaultItens);
    });

	return {
		execute: function () {
			ChatCommand.emit("fetchFromVault",{});
		}
	}
}();