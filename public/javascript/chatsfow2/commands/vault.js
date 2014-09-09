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

    ChatCommand.on("fetchFromVault", function(vaultItems) {
        GifnailPresenter.show(VaultProvider.create(vaultItems));
    });

	return {
		execute: function () {
			ChatCommand.emit("fetchFromVault",{});
		}
	}
}();

var VaultProvider = {
    GIFNAILS_PER_QUERY : 4,

    create: function(vaultItems){
        return {
            fetchGifnails: function(){
                var items = vaultItems.splice(0, VaultProvider.GIFNAILS_PER_QUERY);
                return $.when( {data: items} );
            }
        }
    }
}