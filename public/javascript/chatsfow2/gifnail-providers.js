var GiphySearchProvider = {

    GIFNAILS_PER_QUERY : 4,

    create: function(query, offset){
        return {
            fetchGifnails: function(){
                var $promise = $.ajax({
                    type: "GET",
                    url: "https://api.giphy.com/v1/gifs/search?q=" + encodeURI(query) +
                        "&api_key=dc6zaTOxFJmzC&limit=" + GiphySearchProvider.GIFNAILS_PER_QUERY  + "&offset=" + offset
                });
                offset += GiphySearchProvider.GIFNAILS_PER_QUERY;
                return $promise;
            }
        }
    }
}

var VaultProvider = {
    GIFNAILS_PER_QUERY : 20,

    create: function(vaultItems){
        return {
            fetchGifnails: function(){
                var items = vaultItems.splice(0, VaultProvider.GIFNAILS_PER_QUERY);
                return $.when( {data: items, isVault: true} );
            }
        }
    }
}

