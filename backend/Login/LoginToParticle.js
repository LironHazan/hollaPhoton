/**
 * Created by liron on 9/4/15.
 */

var spark = require('spark');
var Q = require('q');

exports.loginToSpark = function(creds){
    var deffered = Q.defer();

    spark.login({username: creds.email, password: creds.passwd}).then(function success(token){
        deffered.resolve(token);
    }, function error(err){
        deffered.reject(err);
    });

   return deffered.promise;
};

