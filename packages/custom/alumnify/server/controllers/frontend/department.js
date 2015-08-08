'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Department = require('../../models/department');
var ObjectId = mongoose.Types.ObjectId;
var Q = require('q');
//var UserController = require('../../../../../core/users/server/controllers/users')(null);


var DepartmentController = require('../department');
module.exports = DepartmentController;

DepartmentController.getBySchool = function (id) {
    var d = Q.defer();

    var query = Department.find({school: id});
    query.sort('normalized_name');
    query.select('_id department_name');
    query.exec(function (e, departments) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant query departments at this moment'});
        } else {
            d.resolve(departments);
        }
    });

    return d.promise;
};


DepartmentController.getUsersByDepartments = function (departments) {
    var d = Q.defer();

    departments = departments || [];

    var a = Department.aggregate();
    a.match({
        _id: {
            $in: departments.map(function (id) {
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

DepartmentController.handleUser = function (department, user) {
    var d = Q.defer();

    DepartmentController.getById(department)
        .then(function (departmentFound) {
            if (typeof(departmentFound.users) === 'undefined') {
                departmentFound.users = [];
            }

            var i = -1;

            i = departmentFound.users.indexOf(user);

            if (i === -1) {
                departmentFound.users.push(user);
            } else {
                departmentFound.users.splice(i, 1);
            }

            departmentFound.last_update = new Date();


            departmentFound.save(function (e, departmentUpdated) {
                if (e) {
                    console.log(e);
                    d.reject({message: 'Cant update the Department'});
                } else {
                    d.resolve(departmentUpdated);
                }
            });


        })
        .fail(function (error) {
            console.log(error);
            d.reject(error);
        });

    return d.promise;
};

