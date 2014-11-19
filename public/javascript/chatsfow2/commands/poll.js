angular.module("chatsfow", [])
.directive("chatsfowPoll", function(){

    return {
        restrict: 'E',
        templateUrl: "directives/poll.html",
        controller: function($scope) {

            $scope.enabled = false;
            $scope.poll = {
                question : "",
                options: [
                    {description: ''},
                    {description: ''},
                    {description: ''},
                    {description: ''}
                ]
            }

            $scope.submit = function(){
                $("#chatForm").show();
                $("#poll-form").hide();
            }

        }
    }
});

$(document).keyup(function(e) {
    if (e.keyCode == 27){
        $("#chatForm").show();
        $("#poll-form").hide();
    }
});

var PollCommand = {
    execute: function() {
        $("#chatForm").hide();
        $("#poll-form").show();
    }
};