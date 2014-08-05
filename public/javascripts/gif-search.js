function findGifs(query){

    var gifs = []

    $.ajax({
        type: "GET",
        url: "http://api.giphy.com/v1/gifs/search?q=" + encodeURI(query) + "&api_key=dc6zaTOxFJmzC&limit=5",
        async: false,
        success: function(response){
            response.data.forEach(function(element){
                gifs.push(element.images.original.url);
            });
        }
    });

    return gifs;

}