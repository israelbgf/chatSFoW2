expect = require("chai").expect

describe('SampleTestCase', function(){
    describe('truthyMethod()', function(){
        it('should be true when obvious true comparison is used', function(){
            expect(null == undefined).to.be.true;
        })
    })
});