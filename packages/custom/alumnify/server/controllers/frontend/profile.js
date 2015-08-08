'use strict';

//Mixpanel
var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init('5e93ef4cedc005541c1e44b5bd28c405');

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Profile = require('../../models/profile');

var ProfileController = require('../profile');
module.exports = ProfileController;
var Q = require('q'),
    async = require('async');

var UserAppController = require('./userapp');


var CompanyController = require('./company');
var DepartmentController = require('./department');
var MajorController = require('./major');
var AffinityGroupController = require('./affinitygroup');


var handleCompanyDepartmentUser = function (company, department, user) {
    var d = Q.defer();

    var companyUser = function (cb) {
        CompanyController.handleUser(company, user)
            .then(function () {
                cb(null, true);
            })
            .fail(function (error) {
                cb(error);
            });
    };

    var departmentUser = function (cb) {
        DepartmentController.handleUser(department, user)
            .then(function () {
                cb(null, true);
            })
            .fail(function (error) {
                cb(error);
            });
    };

    var after = function (e, results) {
        if (e) {
            console.log(e);
            d.reject(e);
        } else {
            d.resolve(results);
        }
    };


    async.parallel({
        company: companyUser,
        department: departmentUser
    }, after);


    return d.promise;
};

ProfileController.handleMajor = function (user, major) {
    var d = Q.defer();

    ProfileController.getOrCreate(user)
        .then(function (profileFound) {
            profileFound.addMajor(major)
                .then(function (profileUpdated) {
                    MajorController.getById(major)
                        .then(function (majorFound) {
                            majorFound.addUser(profileFound.user)
                                .then(function (majorUpdated) {
                                    mixpanel.track("Edited Profile", {category: "Major"});
                                    d.resolve(true);
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
                })

                .fail(function (error) {
                    console.log(error);
                    d.reject(error);
                });
        });
    return d.promise;
};


ProfileController.addCompany = function (req, res) {
    var id = req.userapp;
    // Object {company: 'ID', department: 'ID'}
    var oCompany = req.body.company_department;


    ProfileController._getOrCreate(id)
        .then(function (profileFound) {
            profileFound.addCompany(oCompany)
                .then(function (profileUpdated) {

                    handleCompanyDepartmentUser(oCompany.company, oCompany.department, id)
                        .then(function (results) { // In case we need to check, but its returning {company: true, department: true}
                            mixpanel.track("Edited Profile", {category: "Company + Department"});
                            return res.json({
                                added: true
                            });
                        })
                        .fail(function (error) {
                            console.log(error);
                            return res.json(400).json(error);
                        });


                })
                .fail(function (error) {
                    console.log(error);
                    return res.json(400).json(error);
                })
        })
        .fail(function (error) {
            console.log(error);
            return res.json(400).json(error);
        });
};

ProfileController.deleteCompany = function (req, res) {
    var id = req.userapp;
    var company_department = req.params.company_department;


    ProfileController._getOrCreate(id)
        .then(function (profileFound) {
            var o = profileFound.company_department.id(company_department);
            if (typeof(o) !== 'undefined') {
                o.remove();
                profileFound.last_update = new Date();
                profileFound.save(function (e, profileUpdated) {
                    if (e) {
                        console.log(e);
                        return res.status(400).json({message: 'Cant remove the Company-Department at this moment'});
                    }
                    // TODO REMOVE USER FROM COMPANIES AND DEPARTMENTS

                    handleCompanyDepartmentUser(o.company, o.department, id)
                        .then(function (results) { // In case we need to check, but its returning {company: true, department: true}
                            return res.json({removed: true});
                        })
                        .fail(function (error) {
                            console.log(error);
                            return res.json(400).json(error);
                        });
                });
            } else {
                return res.status(400).json({message: 'Company-Department Id doesnt exists'});
            }
        })
        .fail(function (error) {
            console.log(error);
            return res.json(400).json(error);
        });
};


ProfileController.updateInfo = function (req, res) {
    var id = req.userapp;
    var _display_name = req.body.display_name;
    var _about = req.body.about || "";
    ProfileController._getOrCreate(id)
        .then(function (profileFound) {
            profileFound.display_name = _display_name.trim();
            profileFound.about = _about.trim();
            profileFound.last_update = new Date();
            profileFound.save(function (e, profileUpdated) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Cant update the profile'});
                }
                mixpanel.track("Edited Profile", {category: "Basic Info"});
                return res.json({
                    updated: true
                });
            });

        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });
};


ProfileController.handleAffinityGroup = function (req, res) {
    var user = req.userapp;
    var affinity = req.params.affinity;


    ProfileController._getOrCreate(user)
        .then(function (profileFound) {

            var i = -1;
            i = profileFound.affinity_groups.indexOf(affinity);
            if (i === -1) {
                profileFound.affinity_groups.push(affinity);
            } else {
                profileFound.affinity_groups.splice(i, 1);
            }


            profileFound.last_update = new Date();
            profileFound.save(function (e, profileUpdated) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Cant update the profile'});
                }

                AffinityGroupController.handleUser(affinity, user)
                    .then(function (affinityUpdated) {
                        mixpanel.track("Edited Profile", {category: "Affinity Group"});
                        return res.json({added: (i === -1)});
                    })
                    .fail(function (error) {
                        console.log(error);
                        return res.status(400).json(error);
                    });
            });
        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });


};

