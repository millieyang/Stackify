'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Profile = require('../models/profile');


var ProfileController = {};
module.exports = ProfileController;

var Q = require('q');
//var UserController = require('../../../../core/users/server/controllers/users')(null);

var UserAppController = require('./userapp');


var _getOrCreate = function (user) {
    var d = Q.defer();

    UserAppController.getById(user)
        .then(function (userFound) {

            Profile.getOrCreate(userFound._id)
                .then(function (profileFound) {
                    d.resolve(profileFound);
                })
                .fail(function (error) {
                    console.log(error);
                    d.reject(error);
                });
        })
        .fail(function (error) {
            console.log(error);
            d.reject(error);
        });

    return d.promise;
};

ProfileController._getOrCreate = _getOrCreate;

ProfileController.getOrCreate = function (req, res) {
    var id = req.params.id;

    _getOrCreate(id)
        .then(function (profileFound) {
            return res.json({profile: profileFound});
        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });
};

ProfileController.getUsers = function (users) {
    var d = Q.defer();

    var query = Profile.find({});
    query.where('user').in(users);
    query.populate({path: 'user', model: 'UserApp'});
    query.populate({path: 'company_department.company', model: 'Company'});
    query.populate({path: 'company_department.department', model: 'Department'});
    query.populate({path: 'affinity_groups', model: 'AffinityGroup'});
    query.exec(function (e, usersFound) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant query users'});
        } else {
            d.resolve(usersFound);
        }
    });


    return d.promise;
};


