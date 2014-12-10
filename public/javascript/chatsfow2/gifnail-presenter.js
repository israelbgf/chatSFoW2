var GifnailPresenter = (function(){

    var $inputMessage = $("#inputMessage");
    var $gifnailsBox = $("#gifnailsBox");
    var $chatForm = $("#chatForm");

    $(document).keyup(function(e) {
        if (e.keyCode == 27){
            $gifnailsBox.hide();
            $chatForm.show();
        }
    });

    return {

        show : function(searchProvider) {

            clearGifnailsSearch();

            var $loading = $("<p>Searching Giphy for gifs...</p>");

            $loading.appendTo($gifnailsBox);

            $promise = searchProvider.fetchGifnails();

            $promise.always(function(){
                $loading.remove();
            });

            $promise.done(function(response){
                if(response.data.length > 0)
                    createHTMLForGifnails(response);
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

            function createHTMLForGifnails(gifs) {
                gifs.data.forEach(function(gif){
                    var gifnail = gif.images ? gif.images.original.url : gif.url;
                    var title = gif.images ? "" : gif.alias;

                    $("<img>")
                        .attr("title", title)
                        .attr("src", gifnail)
                        .addClass(gifs.isVault ? "vaultnail" : "gifnail")
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
})()