'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    UserApp = require('../models/userapp');


var UserAppController = {};

module.exports = UserAppController;


var Q = require('q');
UserAppController.getBySchool = function (id) {
    var d = Q.defer();

    var query = UserApp.find({school: id});
    query.sort('normalized_name');
    // query.select('_id first_name');
    query.exec(function (e, userapps) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant query users at this moment'});
        } else {
            d.resolve(userapps);
        }
    });

    return d.promise;
};

UserAppController.getById = function (id) {
    var d = Q.defer();
    var query = UserApp.findOne({_id: id});
    query.exec(function (e, userFound) {
        if (e) {
            console.log(e);
            d.reject({
                message: 'Cant query users at this moment'
            });
        } else {
            if (userFound === null) {
                d.reject({message: 'User doesnt exists'});
            } else {
                d.resolve(userFound);
            }
        }
    });

    return d.promise;
};

UserAppController.getByIdFromAdmin = function (req, res) {
    var id = req.params.id;
    var query = UserApp.findOne({_id: id});
    query.exec(function (e, userFound) {
        if (e) {
            console.log(e);
            res.status(400).json(e);
        } else {
            if (userFound === null) {
                res.status(400).json('userFound is null');
            } else {
                return res.json({userapp: userFound});
            }
        }
    });

};

