angular.module("chatsfow", [])
.directive("chatsfowPoll", function(){

    return {
        restrict: 'E',
        templateUrl: "directives/poll.html",
        controller: function($scope) {
            $scope.poll = {
                question : "",
                type: "yes-no",
                options: ['', '', '', '']
            }

        }
    }
});

var PollCommand = {
    execute: function() {
        $("#poll-form").show();
    }
};