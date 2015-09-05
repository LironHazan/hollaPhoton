/**
 * Created by liron on 9/4/15.
 */

var spark = require('spark');
var Q = require('q');

exports.loginToSpark = function(username, passwd){
    var deffered = q.defer();

    spark.login({username: username, password: passwd}).then(function success(token){
        deffered.resolve(token);
    }, function error(err){
        deffered.reject(err);
    });

    deffered.promise;
};

