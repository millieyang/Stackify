'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    AffinityGroup = require('../../models/affinitygroup');
var ObjectId = mongoose.Types.ObjectId;


var AffinityGroupController = require('../affinitygroup');

module.exports = AffinityGroupController;
var Q = require('q');
//var UserController = require('../../../../../core/users/server/controllers/users')(null);


/*
 AffinityGroupController.getByAffinityGroups = function (id) {

 var d = Q.defer();

 var query = AffinityGroup.find({
 school: id
 });

 query.sort('normalized_name');
 query.select('_id affinity_group_name');
 query.exec(function (e, affinity_groups) {
 if (e) {
 console.log(e);
 d.reject({message: 'Cant query affinity groups at this moment'});
 } else {
 d.resolve(affinity_groups);
 }
 });

 return d.promise;
 };
 */

AffinityGroupController.getBySchool = function (id) {
    var d = Q.defer();

    var query = AffinityGroup.find({
        school: id
    });

    query.sort('normalized_name');
    query.select('_id affinity_group_name');
    query.exec(function (e, affinitygroups) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant query affinity groups at this moment'});
        } else {
            d.resolve(affinitygroups);
        }
    });

    return d.promise;
};

AffinityGroupController.getUsersByAffinities = function (affinities) {
    var d = Q.defer();

    affinities = affinities || [];

    var a = AffinityGroup.aggregate();
    a.match({
        _id: {
            $in: affinities.map(function (id) {
                return new ObjectId(id);
            })
        }
    });

    a.unwind('users');

    a.group({
        _id: 0,
        users: {$addToSet: '$users'}
    });

    a.exec(function (e, data) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant get users'});
        } else {
            if (data.length > 0) {
                d.resolve(data[0].users || []);
            } else {
                d.resolve([]);
            }
        }
    });
    return d.promise;
};


AffinityGroupController.handleUser = function (affinty, user) {
    var d = Q.defer();

    AffinityGroupController.getById(affinty)
        .then(function (affinityFound) {
            if (typeof(affinityFound.users) === 'undefined') {
                affinityFound.users = [];
            }

            var i = -1;

            i = affinityFound.users.indexOf(user);

            if (i === -1) {
                affinityFound.users.push(user);
            } else {
                affinityFound.users.splice(i, 1);
            }

            affinityFound.last_update = new Date();


            affinityFound.save(function (e, affinityUpdated) {
                if (e) {
                    console.log(e);
                    d.reject({message: 'Cant update the affinity'});
                } else {
                    d.resolve(affinityUpdated);
                }
            });


        })
        .fail(function (error) {
            console.log(error);
            d.reject(error);
        });

    return d.promise;
};

