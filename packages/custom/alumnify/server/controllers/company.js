'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Company = require('../models/company');

//var UserController = require('../../../../core/users/server/controllers/users')(null);
var CompanyController = {};
module.exports = CompanyController;

var SchoolController = require('./school');
var Q = require('q');

CompanyController.getById = function (id) {
    var d = Q.defer();

    var query = Company.findOne({
        _id: id
    });

    query.exec(function (e, companyFound) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant query the company'});
        } else {
            if (companyFound === null) {
                d.reject({message: 'Company doesnt exists'});
            } else {
                d.resolve(companyFound);
            }
        }
    });

    return d.promise;
};


CompanyController.createfromAdmin = function (req, res) {
    var _company = req.body.company;

    SchoolController.getById(_company.school)
        .then(function (schoolFound) {
            var o = {};
            o.company_name = _company.company_name.trim();
            o.normalized_name = o.company_name;
            o.school = schoolFound._id;
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



CompanyController.update = function (req, res) {
   // var id = req.params.id;
    var _company = req.body.company;
    CompanyController.getById(_company._id)
        .then(function (companyFound) {


            companyFound.company_name = _company.company_name.trim();
            companyFound.normalized_name = companyFound.company_name;


            companyFound.last_update = new Date();
            companyFound.save(function (e, companyUpdated) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Cant update the company'});
                }
                return res.json({company: companyUpdated});
            });


        })
        .fail(function (error) {
            console.log(error);

            return res.status(400).json(error);

        });

};

module.exports = CompanyController;


