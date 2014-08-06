$(function (){
    var $inputMessage = $("#inputMessage");
    var $chatForm = $("#chatForm");
    var $gifnailsBox = $("#gifnailsBox");

    $chatForm.on("submit", function(event){
        var input = $inputMessage.val();
        if(isSearchCommand(input)){
            fetchGifnails(input, 0);
            cancelFormSubmission();
        }
    });

    function isSearchCommand(input) {
        return input && input.substr(0, 4) == "!gif";
    }

    function fetchGifnails(input, offset) {

        clearGifnailsSearch();

        var query = input.substr(4).trim();
        var loading = $("<p>Searching Giphy for gifs... :(</p>");

        loading.appendTo($gifnailsBox);

        $promisse = $.ajax({
            type: "GET",
            url: "http://api.giphy.com/v1/gifs/search?q=" + encodeURI(query) +
                "&api_key=dc6zaTOxFJmzC&limit=5&offset=" + offset
        });

        $promisse.always(function(){
           loading.remove();
        });

        $promisse.done(function(response){
            if(response.data.length > 0)
                createHTMLForGifnails(response.data);
            else
                createHTMLForEmptyResults();
        });

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
            $("<button>")
                .text("More...")
                .addClass("inputButton gifnail")
                .click(function () {
                    fetchGifnails(input, offset + 5)
                }).appendTo($gifnailsBox);
        }

        function selectGifnail(event){
            var selectedGifnailURI = $(event.target).attr('src');
            $inputMessage.val(selectedGifnailURI);
            clearGifnailsSearch();
        }

    }

    function clearGifnailsSearch() {
        $gifnailsBox.children().remove();
    }

    function cancelFormSubmission() {
        event.stopImmediatePropagation();
        $inputMessage.val("");
    }

});