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