'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Token = require('../models/token');

var TokenController = {};

module.exports = TokenController;


var Q = require('q');

var UserAppController = require('./userapp');



TokenController.create = function (id, user) {
    var d = Q.defer();

    UserAppController.getById(user)
        .then(function (userFound) {
            Token.create({_id: id, user: userFound._id, date_created: new Date()}, function (e, tokenCreated) {
                if (e) {
                    console.log(e);
                    d.reject({message: 'Cant create the token'});
                } else {
                    d.resolve(tokenCreated);
                }
            });
        })
        .fail(function (error) {
            d.reject(error);
        });

    return d.promise;
};

TokenController.getById = function (id) {
    var d = Q.defer();


    var query = Token.findOne({
        _id: id
    });

    query.exec(function (e, tokenFound) {
        if (e) {
            d.reject({message: 'Cant query the token'});
        } else {
            if (tokenFound === null) {
                d.reject({message: 'Invalid Token or expired'});
            } else {
                d.resolve(tokenFound);
            }
        }
    });

    return d.promise;
};

