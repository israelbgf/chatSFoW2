var GifnailCommand = function (){
    const INITIAL_OFFSET = 0;
    var $inputMessage = $("#inputMessage");

    return {
        execute: function (argument) {
            var input = $inputMessage.val();
            if(isSearchCommand(input)) {
                GifnailPresenter.show(input, INITIAL_OFFSET, giphySearchProvider);
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

function giphySearchProvider(query, offset) {
    var GIFNAILS_PER_QUERY = 4;
    return $.ajax({
        type: "GET",
        url: "http://api.giphy.com/v1/gifs/search?q=" + encodeURI(query) +
            "&api_key=dc6zaTOxFJmzC&limit=" + GIFNAILS_PER_QUERY  + "&offset=" + offset
    });
}

var GifnailPresenter = {

    show : function(input, offset, promisseProvider) {

        var $inputMessage = $("#inputMessage");
        var $chatForm = $("#chatForm");
        var $gifnailsBox = $("#gifnailsBox");

        clearGifnailsSearch();

        const GIFNAILS_PER_QUERY = 4;
        var query = input.substr(4).trim();
        var $loading = $("<p>Searching Giphy for gifs...</p>");

        $loading.appendTo($gifnailsBox);

        $promisse = promisseProvider(input, offset);

        $promisse.always(function(){
           $loading.remove();
        });

        $promisse.done(function(response){
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
                    GifnailPresenter.show(input, offset + GIFNAILS_PER_QUERY, promisseProvider);
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