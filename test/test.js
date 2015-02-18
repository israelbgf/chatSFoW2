var engine = require('../chat/engine');
should = require("chai").should();


describe('Engine', function(){

    describe('countVotes()', function(){
        it('should return 1 vote for single option', function(){
            var userVotes = {"user": {answer: "A"}};
            var result = engine.countVotes(userVotes);
            result.should.have.property("A").equals(1);
        });

        it('should return 2 votes for single option', function(){
            var userVotes = {"user": {answer: "A"}, "otherUser": {answer: "A"}};
            var result = engine.countVotes(userVotes);
            result.should.have.property("A").equals(2);
        });

        it('should return 1 vote for each option', function(){
            var userVotes = {"user": {answer: "A"}, "otherUser": {answer: "B"}};
            var result = engine.countVotes(userVotes);
            result.should.have.property("A").equals(1);
            result.should.have.property("B").equals(1);
        });
    });

});
var configuration = require('../chat/configuration');
describe('Environment', function(){
   describe('getUserHomePath()', function(){
       it('should not return undefined', function(){
           var result = configuration.getUserHomePath();
           should.exist(result);
       })
   });
});