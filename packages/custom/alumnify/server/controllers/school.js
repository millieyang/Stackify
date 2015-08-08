'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    School = require('../models/school');

var SchoolController = {};
module.exports = SchoolController;

//var UserController = require('../../../../core/users/server/controllers/users')(null);
var iv = require('../utils/idvalidator');
var Q = require('q');

var UserAppController = require('./userapp');

SchoolController.getAll = function (req, res) {
    School.find({}).exec(function (e, schools) {
        return res.json({schools: schools});
    })
};


SchoolController.create = function (req, res) {
    var user = req.user._id;
    var _school = req.body.school;
    var o = {};
    o.school_name = _school.school_name.trim();
    o.normalized_name = o.school_name;
    o.school_color = _school.school_color.trim();
    o.school_logo = _school.school_logo.trim();
    o.school_app_name = _school.school_app_name.trim();
    o.school_location = _school.school_location.trim(); // Just a String?
    o.author = user;
    o.date_created = new Date();

    School.create(o, function (e, schoolCreated) {
        if (e) {
            return res.status(400).json({message: 'Cant create the school'});
        }
        return res.json({school: schoolCreated});
    });


};

SchoolController.getById = function (id) {
    var d = Q.defer();

    var query = School.findOne({
        _id: id
    });

    query.exec(function (e, schoolFound) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant query the school'});
        } else {
            if (schoolFound === null) {
                d.reject({message: 'School doesnt exists'});
            } else {
                d.resolve(schoolFound);
            }
        }
    });

    return d.promise;
};

SchoolController.getByName = function (req, res) {
    var name = req.body.name || '';
    var query = School.findOne({
        normalized_name: name.toLowerCase().trim()
    });

    query.exec(function (e, schoolFound) {
        if (e) {
            console.log(e);
            return res.status(400).json({message: 'Cant get schools'});
        }
        return res.json({school: schoolFound});
    });
};

SchoolController.getByID = function (req, res) {
    var id = req.params.id;
    var d = Q.defer();

    var query = School.findOne({
        _id: id
    });

    query.exec(function (e, schoolFound) {
        if (e) {
            return res.status(400).json({message: 'Cant get schools'});
        }
        return res.json({school: schoolFound});
    });

};

SchoolController.getReportedUsers = function () {
    var query = School.findOne({
        _id: id
    });
    query.populate({
        path: 'users',
        ref: 'UserApp',
        select: '_id first_name last_name grad_year',
        match: {reported: true}
    });
    query.exec(function (e, schoolFound) {
        if (e) {
            console.log(e);
            return res.status(400).json({message: 'Cant get reported users at this moment'});
        }

        if (schoolFound === null) {
            return res.status(400).json({message: 'School doesnt exists'});
        }

        return res.json({
            reported_users: schoolFound.users
        });
    });
};


SchoolController.getAllUsers = function (req, res) {
    var id = req.params.id;
    if (!iv.isValid(id)) {
        return res.status(400).json({message: 'Invalid School ID'});
    }
    //Validating School first
    SchoolController.getById(id)
        .then(function (schoolFound) {

            UserAppController.getBySchool(schoolFound._id)
                .then(function (userapps) {
                    return res.json({
                        userapps: userapps
                    });
                })
                .fail(function (error) {
                    console.log(error);
                    return res.status(400).json(error);
                });
        })
        .fail(function (error) {
            console.log(error);
            res.status(400).json(error);
        });
};


