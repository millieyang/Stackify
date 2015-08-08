'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Major = require('../models/major');

//var UserController = require('../../../../../core/users/server/controllers/users')(null);

var MajorController = {};
module.exports = MajorController;
var SchoolController = require('./school');

var Q = require('q');


MajorController.getById = function (id) {

    var d = Q.defer();


    var query = Major.findOne({
        _id: id
    });


    query.exec(function (e, majorFound) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant query majors at this moment'});
        } else {
            if (majorFound === null) {
                d.reject({message: 'Major doesnt exists'});
            } else {
                d.resolve(majorFound);
            }
        }
    });


    return d.promise;
};

MajorController.getAll = function (req, res) {
    Major.find({}).exec(function (e, majors) {
        return res.json({majors: majors});
    })
};
//
//MajorController.getMajorsfromAdmin = function (req, res) {
//    var id = req.params.id;
//    SchoolController.getById(id) {
//
//    }
//
//}

// MajorController.createDummy = function (req, res) {
//     var user = req.user._id;
//     var _major = req.body.major;
//     var o = {};
//     o.major_name = _major.major_name.trim();
//     o.normalized_name = o.major_name;
//     o.author = user;
//     o.date_created = new Date();

//     Major.create(o, function (e, majorCreated) {
//         if (e) {
//             return res.status(400).json({message: 'Cant create the major'});
//         }
//         return res.json({major: majorCreated});
//     });
// };

MajorController.create = function (req, res) {
    var _major = req.body.major;
    var user = req.user._id;
    var o = {};
    SchoolController.getById(_major.school)
        .then(function (schoolFound) {

            o.major_name = _major.major_name.trim();
            o.normalized_name = o.major_name;
            o.school = schoolFound._id;
            o.author = user;
            o.date_created = new Date();

            Major.create(o, function (e, majorCreated) {
                if (e) {
                    return res.status(400).json({message: 'Cannot create the major'});
                }

                schoolFound.majors.push(majorCreated._id);
                schoolFound.last_update = new Date();
                schoolFound.save(function (er, schoolUpdated) {
                    if (er) {
                        console.log(er);
                        return res.status(400).json({message: 'Major created but could not add to the School'});
                    }
                    return res.json({major: majorCreated});
                });
            });
        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });
};


MajorController.update = function (req, res) {
    //var id = req.params.id;
    var _major = req.body.major;
    MajorController.getById(_major._id)
        .then(function (majorFound) {


            majorFound.major_name = _major.major_name.trim();
            majorFound.normalized_name = majorFound.major_name;


            majorFound.last_update = new Date();
            majorFound.save(function (e, majorUpdated) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Cant update the major'});
                }
                return res.json({major: majorUpdated});
            });


        })
        .fail(function (error) {
            console.log(error);

            return res.status(400).json(error);

        });

};