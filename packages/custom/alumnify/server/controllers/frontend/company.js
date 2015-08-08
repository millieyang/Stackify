'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    Company = require('../../models/company');
var CompanyController = require('../company');
module.exports = CompanyController;
var SchoolController = require('../school'); //Todo extend frontend from admin controller

var Q = require('q');

//var UserController = require('../../../../../core/users/server/controllers/users')(null);


CompanyController.getBySchool = function (id) {
    var d = Q.defer();

    var query = Company.find({school: id});
    query.sort('normalized_name');
    query.select('_id company_name');
    query.exec(function (e, companies) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant query companies at this moment'});
        } else {
            d.resolve(companies);
        }
    });
    return d.promise;
};

CompanyController.create = function (req, res) {
    var user = req.userapp;
    var _company = req.body.company;

    SchoolController.getById(_company.school)
        .then(function (schoolFound) {
            var o = {};
            o.company_name = _company.company_name.trim();
            o.normalized_name = o.company_name;
            o.school = schoolFound._id;
            o.author = user;
            o.user_created = true;

            Company.create(o, function (e, companyCreated) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Cant create the company'});
                }
                // I can do this here or into the model, i rather keep de mvc pattern and no relationate models
                schoolFound.companies.push(companyCreated._id);
                schoolFound.last_update = new Date();
                schoolFound.save(function (er, schoolUpdated) {
                    if (er) {
                        return res.status(400).json({message: 'Company created but couldnt be added to the School'});
                    }
                    return res.json({company: companyCreated});
                });
            });
        })
        .fail(function (error) {
            console.log(error);
            res.status(400).json(400);
        });


};

CompanyController.getUsersByCompanies = function (companies) {
    var d = Q.defer();

    companies = companies || [];

    var a = Company.aggregate();
    a.match({
        _id: {
            $in: companies.map(function (id) {
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

CompanyController.handleUser = function (company, user) {
    var d = Q.defer();

    CompanyController.getById(company)
        .then(function (companyFound) {
            if (typeof(companyFound.users) === 'undefined') {
                companyFound.users = [];
            }

            var i = -1;

            i = companyFound.users.indexOf(user);

            if (i === -1) {
                companyFound.users.push(user);
            } else {
                companyFound.users.splice(i, 1);
            }

            companyFound.last_update = new Date();


            companyFound.save(function (e, companyUpdated) {
                if (e) {
                    console.log(e);
                    d.reject({message: 'Cant update the Company'});
                } else {
                    d.resolve(companyUpdated);
                }
            });


        })
        .fail(function (error) {
            console.log(error);
            d.reject(error);
        });

    return d.promise;
};

