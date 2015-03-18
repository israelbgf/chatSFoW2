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

describe('Configuration module', function(){
   describe('getUserHomePath()', function(){
       it('should return exception when user path does not exist', function(){
           should.Throw(function(){
               configuration.getUserHomePath({});
           });
       });
       it('should return homepath on windows', function(){
           var env = {USERPROFILE: "C://User//Fera"};
           var result = configuration.getUserHomePath(env);
           result.should.equal('C://User//Fera');
       });
       it('should return homepath on linux', function(){
           var env = {HOME: "/dude-o/"};
           var result = configuration.getUserHomePath(env);
           result.should.equal('/dude-o/');
       });
   });

    describe('from()', function(){
        it('should return configuration data from application', function(){
            var env = {};
            var app = {
                server_port: 5000,
                persistence: {
                    provider: configuration.MONGODB,
                    host: "host",
                    user: "user",
                    password: "pass",
                    database_name: "test",
                    database_port: "1234"
                }
            };

            var config = configuration.from(env, app);

            config.should.have.property("server_port").equal(5000);
            config.should.have.deep.property("persistence.provider").equal(configuration.MONGODB);
            config.should.have.deep.property("persistence.host").equal("host");
            config.should.have.deep.property("persistence.user").equal("user");
            config.should.have.deep.property("persistence.password").equal("pass");
            config.should.have.deep.property("persistence.database_name").equal("test");
            config.should.have.deep.property("persistence.database_port").equal("1234");
        });

        it('should override application configuration if environment is set', function(){
            var env = {
                CHATSFOW_PORT: 5000,
                CHASTSFOW_PROVIDER: configuration.MONGODB,
                CHATSFOW_DB_HOST: 'host',
                CHATSFOW_DB_USER: 'user',
                CHATSFOW_DB_PASSWORD: 'pass',
                CHATSFOW_DB_NAME: 'test',
                CHATSFOW_DB_PORT: '1234'
            };
            var app = {};

            var config = configuration.from(env, app);

            config.should.have.property("server_port").equal(5000);
            config.should.have.deep.property("persistence.provider").equal("mongodb");
            config.should.have.deep.property("persistence.host").equal("host");
            config.should.have.deep.property("persistence.user").equal("user");
            config.should.have.deep.property("persistence.password").equal("pass");
            config.should.have.deep.property("persistence.database_name").equal("test");
            config.should.have.deep.property("persistence.database_port").equal("1234");
        });

        it('should return config from environment first if it exists', function(){
            var env = {server_port: 5000};
            var app = {server_port: 8000};
            result = configuration.getPrioritaryConfig('server_port', env, app)
            result.should.be.equal(5000)
        });
        
        
        it('should return config from application config if it was not found on environment', function(){
            var env = {};
            var app = {server_port: 8000};
            result = configuration.getPrioritaryConfig('server_port', env, app)
            result.should.be.equal(8000)
        });

        it('should return environment config from nested property', function(){
            var env = {
                persistence: {
                    provider: configuration.FILE
                }
            };
            var app = {};
            result = configuration.getPrioritaryConfig('persistence.provider', env, app);
            result.should.be.equal(configuration.FILE);
        });

        it('should return application config from nested property', function(){
            var env = {};
            var app = {
                persistence: {
                    provider: configuration.MONGODB
                }
            };
            result = configuration.getPrioritaryConfig('persistence.provider', env, app);
            result.should.be.equal(configuration.MONGODB);
        });

    });

});