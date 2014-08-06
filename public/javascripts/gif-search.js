$(function (){
    var $inputMessage = $("#inputMessage");
    var $chatForm = $("#chatForm");
    var $gifnailsBox = $("#gifnailsBox");

    $chatForm.on("submit", function(event){
        var input = $inputMessage.val();

        function cancelFormSubmission() {
            event.stopImmediatePropagation();
            $inputMessage.val("");
        }

        if(isSearchCommand(input)){
            showGifnails(input);
            cancelFormSubmission();
        }
    });

    function isSearchCommand(input) {
        return input && input.substr(0, 4) == "!gif";
    }

    function showGifnails(input) {
        $gifnailsBox.children().remove();
        var query = input.substr(4).trim();
        var gifs = findGifs(query);

        if(gifs.length > 0){
            findGifs(query).forEach(function(gifURI){
                $("<img>")
                    .attr("src", gifURI)
                    .addClass("gifnail")
                    .click(selectGifnail)
                    .appendTo($gifnailsBox);
            });
        }else{
            $("<p>Nothing found, sorry bro... :(</p>")
                .appendTo($gifnailsBox)
                .fadeOut(3000);
        }
    }

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

    function selectGifnail(event){
        var selectedGifnailURI = $(event.target).attr('src');
        $inputMessage.val(selectedGifnailURI);
        $gifnailsBox.children().remove();
    }
});