var GifnailCommand = function (){
    const INITIAL_OFFSET = 0;
    var $inputMessage = $("#inputMessage");

    return {
        execute: function (argument) {
            var input = $inputMessage.val();
            if(isSearchCommand(input)) {
                GifnailPresenter.show(GiphySearchProvider.create(input.substr(4).trim(), INITIAL_OFFSET));
                cancelFormSubmission();
            }
        }
    }

    function isSearchCommand(input) {
        return input && input.substr(0, 4) == "!gif";
    }

    function cancelFormSubmission() {
        event.stopImmediatePropagation();
        $inputMessage.val("");
    }

}();

var GiphySearchProvider = {

    GIFNAILS_PER_QUERY : 4,

    create: function(query, offset){
        return {
            fetchGifnails: function(){
                var $promise = $.ajax({
                    type: "GET",
                    url: "http://api.giphy.com/v1/gifs/search?q=" + encodeURI(query) +
                        "&api_key=dc6zaTOxFJmzC&limit=" + GiphySearchProvider.GIFNAILS_PER_QUERY  + "&offset=" + offset
                });
                offset += GiphySearchProvider.GIFNAILS_PER_QUERY;
                return $promise;
            }
        }
    }
}

var GifnailPresenter = {

    show : function(searchProvider) {

        var $inputMessage = $("#inputMessage");
        var $chatForm = $("#chatForm");
        var $gifnailsBox = $("#gifnailsBox");

        clearGifnailsSearch();

        var $loading = $("<p>Searching Giphy for gifs...</p>");

        $loading.appendTo($gifnailsBox);

        $promise = searchProvider.fetchGifnails();

        $promise.always(function(){
           $loading.remove();
        });

        $promise.done(function(response){
            if(response.data.length > 0)
                createHTMLForGifnails(response.data);
            else
                createHTMLForEmptyResults();
            showGifnailboxWithAnimation();
        });

        function showGifnailboxWithAnimation() {
            $gifnailsBox.show(500);
        }

        function createHTMLForEmptyResults() {
            $("<p>Nothing found, sorry bro... :(</p>")
                .appendTo($gifnailsBox)
                .fadeOut(3000);
        }

        function createHTMLForGifnails(data) {
            data.forEach(function(gif){
                $("<img>")
                    .attr("src", gif.images.original.url)
                    .addClass("gifnail")
                    .click(selectGifnail)
                    .appendTo($gifnailsBox);
            });
            $("<br>")
                .appendTo($gifnailsBox);
            $("<button>")
                .text("More...")
                .addClass("inputButton gifnail")
                .click(function(){
                    GifnailPresenter.show(searchProvider);
                }).appendTo($gifnailsBox);
        }

        function selectGifnail(event){
            var selectedGifnailURI = $(event.target).attr('src');
            $inputMessage.val(selectedGifnailURI);
            clearGifnailsSearch();
            $inputMessage.focus();
        }

        function clearGifnailsSearch() {
            $gifnailsBox.hide();
            $gifnailsBox.children().remove();
        }

    }

}