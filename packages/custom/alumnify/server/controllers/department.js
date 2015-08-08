'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Department = require('../models/department');


var DepartmentController = {};
module.exports = DepartmentController;

var SchoolController = require('./school');
//var UserController = require('../../../../core/users/server/controllers/users')(null);

var Q = require('q');


DepartmentController.getById = function (id) {
    var d = Q.defer();

    var query = Department.findOne({
        _id: id
    });

    query.exec(function (e, departmentFound) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant query the Department'});
        } else {
            if (departmentFound === null) {
                d.reject({message: 'Department doesnt exists'});
            } else {
                d.resolve(departmentFound);
            }
        }
    });

    return d.promise;
};

DepartmentController.create = function (req, res) {
    var user = req.user._id;
    var _department = req.body.department;
    SchoolController.getById(_department.school)
        .then(function (schoolFound) {
            var o = {};
            o.department_name = _department.department_name.trim();
            o.normalized_name = o.department_name;
            o.school = schoolFound._id;
            o.author = user;

            Department.create(o, function (e, departmentCreated) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Cant create the department'});
                }
                // I can do this here or into the model, i rather keep de mvc pattern and no relationate models
                schoolFound.departments.push(departmentCreated._id);
                schoolFound.last_update = new Date();
                schoolFound.save(function (er, schoolUpdated) {
                    if (er) {
                        return res.status(400).json({message: 'Department created but couldnt be added to the School'});
                    }
                    return res.json({department: departmentCreated});
                });
            });
        })
        .fail(function (error) {
            console.log(error);
            res.status(400).json(400);
        });


};


DepartmentController.update = function (req, res) {
    //var id = req.params.id;
    var _department = req.body.department;
    DepartmentController.getById(_department._id)
        .then(function (departmentFound) {


            departmentFound.department_name = _department.department_name.trim();
            departmentFound.normalized_name = departmentFound.department_name;


            departmentFound.last_update = new Date();
            departmentFound.save(function (e, departmentUpdated) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Cant update the department'});
                }
                return res.json({department: departmentUpdated});
            });


        })
        .fail(function (error) {
            console.log(error);

            return res.status(400).json(error);

        });

};

