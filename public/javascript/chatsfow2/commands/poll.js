angular.module("chatsfow", ["angularModalService"])
.controller('CustomController', ['$scope', 'close', function($scope, close) {
    $scope.display = true;

    $scope.close = function () {
        $scope.display = false;
        close($scope.poll.answer);
    }
}])
.directive("chatsfowPoll", ['ModalService', function(ModalService){

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

                ModalService.showModal({
                    templateUrl: "directives/custom.html",
                    controller: "CustomController"
                }).then(function(modal) {
                    modal.scope.poll = poll;

                    modal.close.then(function(answer) {
                        ChatCommand.emit("pollAnswer", answer);
                        $scope.isReport = true;
                    });
                });

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
                var html = "<div class='usersOnline'><b>" + result.question + "</b><ul class='usersOnline'>";
                for(var item in result.votes){
                    html += "<li>" + item + "(" +  result.votes[item] + ")</li>";
                }
                $("#messagesBox").append(html + "</ul></div>");


                $scope.isReport = false;
                $scope.isOwner = false;
                $scope.$apply();
            });
        }
    }
}]);

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