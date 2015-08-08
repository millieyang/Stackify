'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Major = require('../../models/major');
var ObjectId = mongoose.Types.ObjectId;
var Q = require('q');
//var UserController = require('../../../../../core/users/server/controllers/users')(null);

var MajorController = {};

module.exports = MajorController;

MajorController.getBySchool = function (id) {
    var d = Q.defer();

    var query = Major.find({
        school: id
    });

    query.sort('normalized_name');
    query.select('_id major_name');
    query.exec(function (e, majors) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant query majors at this moment'});
        } else {
            d.resolve(majors);
        }
    });

    return d.promise;
};

MajorController.getUsersByMajors = function (majors) {
    var d = Q.defer();

    majors = majors || [];

    var a = Major.aggregate();
    a.match({
        _id: {
            $in: majors.map(function (id) {
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

