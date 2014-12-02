angular.module("chatsfow", [])
.directive("chatsfowPoll", function(){

    return {
        restrict: 'E',
        templateUrl: "directives/poll.html",
        controller: function($scope) {

            $scope.isReport = false;
            $scope.isOwner = false;

            $scope.submit = function(){
                $("#chatForm").show();
                $("#poll-form").hide();

                ChatCommand.emit("pollRequest", $scope.poll);
            };

            $scope.close = function(){
                $("#chatForm").show();
                $("#poll-form").hide();

                ChatCommand.emit("pollClose");
            };

            $scope.back = function(){
                $("#chatForm").show();
                $("#poll-form").hide();
            };

            ChatCommand.on("pollRequest", function(poll) {
                var question = poll.question + "?\n";
                poll.options.forEach(function(option, index) {
                    question += "\n" + (index + 1) + ". " + option.description;
                });

                var answer = prompt(question);

                ChatCommand.emit("pollAnswer", answer);
                $scope.isReport = true;
                $scope.$apply();
            });

            ChatCommand.on("pollbrema", function(msg) {
                toastr.error("POLLBREMA! " + msg);
            });

            ChatCommand.on("pollRefresh", function(poll) {
                $scope.poll = poll;

                if (ChatCommand.getUserEmail() == poll.owner)
                    $scope.isOwner = true;
                if (poll.isActive)
                    $scope.isReport = true;

                $scope.$apply();
            });

            ChatCommand.on("pollClose", function (result) {
                ChatCommand.scrollToBottom();
                $("#poll-form input").val("");
                var html = "<div class='usersOnline'><b>Poll result:</b><ul class='usersOnline'>";
                for(var item in result){
                    html += "<li>" + item + "(" +  result[item] + ")</li>";
                }
                $("#messagesBox").append(html + "</ul></div>");


                $scope.isReport = false;
                $scope.isOwner = false;
                $scope.$apply();
            });
        }
    }
});

$(document).keyup(function(e) {
    if (e.keyCode == 27){
        $("#chatForm").show();
        $("#poll-form").hide();
    }
});

var PollCommand = function() {

    return {
        execute: function() {
            $("#chatForm").hide();
            $("#poll-form").show();
        }
    }
}();