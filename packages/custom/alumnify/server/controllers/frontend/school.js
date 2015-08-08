'use strict';

//Mixpanel
var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init('5e93ef4cedc005541c1e44b5bd28c405');

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    School = require('../../models/school');

var SchoolController = require('../school');

module.exports = SchoolController;
var UserAppController = require('./userapp');

var ProfileController = require('./profile'),
    AffinityGroupController = require('./affinitygroup'),
    MajorController = require('./major'),
    CompanyController = require('./company'),
    DepartmentController = require('./department');

var Q = require('q');
var async = require('async');
var iv = require('../../utils/idvalidator');
var _ = require('underscore');

//var UserController = require('../../../../../core/users/server/controllers/users')(null);


SchoolController.getMajors = function (req, res) {
    var id = req.params.id;
    if (!iv.isValid(id)) {
        return res.status(400).json({message: 'Invalid School ID'});
    }
    var query = School.findOne({
        _id: id
    });
    query.populate({path: 'majors', ref: 'Major', select: '_id major_name'});
    query.exec(function (e, schoolFound) {
        if (e) {
            console.log(e);
            return res.status(400).json({message: 'Cant get majors at this moment'});
        }

        if (schoolFound === null) {
            return res.status(400).json({message: 'School doesnt exists'});
        }

        return res.json({
            majors: schoolFound.majors
        });
    });
};

SchoolController.getCompanies = function (req, res) {
    var id = req.params.id;
    if (!iv.isValid(id)) {
        return res.status(400).json({message: 'Invalid School ID'});
    }
    //Validating School first
    SchoolController.getById(id)
        .then(function (schoolFound) {
            CompanyController.getBySchool(schoolFound._id)
                .then(function (companies) {
                    res.json({
                        companies: companies
                    });
                })
                .fail(function (error) {
                    console.log(error);
                    res.status(400).json(error);
                });
        })
        .fail(function (error) {
            console.log(error);
            res.status(400).json(error);
        });
};

SchoolController.getDepartments = function (req, res) {
    var id = req.params.id;
    if (!iv.isValid(id)) {
        return res.status(400).json({message: 'Invalid School ID'});
    }
    //Validating School first
    SchoolController.getById(id)
        .then(function (schoolFound) {
            DepartmentController.getBySchool(schoolFound._id)
                .then(function (departments) {
                    res.json({
                        departments: departments
                    });
                })
                .fail(function (error) {
                    console.log(error);
                    res.status(400).json(error);
                });
        })
        .fail(function (error) {
            console.log(error);
            res.status(400).json(error);
        });
};

SchoolController.getAffinityGroups = function (req, res) {
    var id = req.params.id;
    if (!iv.isValid(id)) {
        return res.status(400).json({message: 'Invalid School ID'});
    }
    var query = School.findOne({
        _id: id
    });
    query.populate({
        path: 'affinity_groups',
        ref: 'AffinityGroup',
        select: '_id affinity_group_name',
        sort: 'normalized_name'
    });
    query.exec(function (e, schoolFound) {
        if (e) {
            console.log(e);
            return res.status(400).json({message: 'Cant get affinity groups at this moment'});
        }

        if (schoolFound === null) {
            return res.status(400).json({message: 'School doesnt exists'});
        }

        return res.json({
            affinity_groups: schoolFound.affinity_groups
        });
    });
};

SchoolController.getNearest = function (req, res) {
    var id = req.params.id;
    var user = req.userapp;
    var page = req.params.page || 1;
    var per_page = 15;

    var getSchoolInformation = function (cb) {
        SchoolController.getById(id)
            .then(function (schoolFound) {
                cb(null, schoolFound);
            })
            .fail(function (error) {
                cb(error);
            });
    };

    var getUserInformation = function (cb) {
        UserAppController.getById(user)
            .then(function (userFound) {
                var connections = [];
                connections = userFound.connections.map(function (connection) {
                    return connection.user;
                });
                connections.push(userFound.user._id);
                cb(null, {
                    location: userFound.location,
                    connections: connections
                });
            })
            .fail(function (error) {
                console.log(error);
                cb(error);
            });

    };

    var after = function (e, results) {
        if (e) {
            console.log(e);
            return res.status(400).json(e);
        }

        UserAppController.getNearest(results.school._id, results.user, page, per_page)
            .then(function (usersFound) {

                ProfileController.getUsers(usersFound)
                    .then(function (usersFound) {
                        return res.json({
                            users: usersFound
                        });
                    })
                    .fail(function (error) {
                        console.log(error);
                        return res.status(400).json(error);
                    });


            })
            .fail(function (error) {
                console.log(error);
                return res.status(400).json(error);
            });
    };

    async.parallel({
        school: getSchoolInformation,
        user: getUserInformation
    }, after);
};


SchoolController.getUsersFiltered = function (req, res) {
    var id = req.params.id;
    var user = req.userapp;
    var page = req.params.page || 1;
    var per_page = 15;

    var distance = req.body.distance || 10;
    var minYear = req.body.min_year || 1970;
    var maxYear = req.body.max_year || 2019;
    var majors = req.body.majors || [];
    var companies = req.body.companies || [];
    var affinities = req.body.affinities || [];
    var departments = req.body.departments || [];

    var users = [];

    var getUserInformation = function (cb) {
        UserAppController.getById(user)
            .then(function (userFound) {
                cb(null, userFound);
            })
            .fail(function (error) {
                console.log(error);
                cb(error);
            });

    };


    var getMajorUsers = function (cb) {
        MajorController.getUsersByMajors(majors)
            .then(function (usersFound) {
                cb(null, usersFound);
            })
            .fail(function (error) {
                console.log(error);
                cb(error);
            });
    };

    var getCompanyUsers = function (cb) {
        CompanyController.getUsersByCompanies(companies)
            .then(function (usersFound) {
                cb(null, usersFound);
            })
            .fail(function (error) {
                console.log(error);
                cb(error);
            });
    };
    var getAffinityUsers = function (cb) {
        AffinityGroupController.getUsersByAffinities(affinities)
            .then(function (usersFound) {
                cb(null, usersFound);
            })
            .fail(function (error) {
                console.log(error);
                cb(error);
            });
    };
    var getDepartmentUsers = function (cb) {
        DepartmentController.getUsersByDepartments(deparments)
            .then(function (usersFound) {
                cb(null, usersFound);
            })
            .fail(function (error) {
                console.log(error);
                cb(error);
            });
    };

    var o = {};

    o.user = getUserInformation;

    // We may can validate the school too, and use the ID param that we are getting

    if (majors.length > 0) {
        mixpanel.track("Filters Inputted", {type: "Majors"});
        o.fromMajors = getMajorUsers; // 1
    }

    if (companies.length > 0) {
        mixpanel.track("Filters Inputted", {type: "Companies"});
        o.fromCompanies = getCompanyUsers; //2,1
    }

    if (affinities.length > 0) {
        mixpanel.track("Filters Inputted", {type: "Affinity Groups"});
        o.fromAffinities = getAffinityUsers; //3, 2
    }

    if (departments.length > 0) {
        mixpanel.track("Filters Inputted", {type: "Departments"});
        o.fromDepartments = getDepartmentUsers;
    }

    var afterParallel = function (e, results) {
        if (e) {
            return res.status(400).json(e);
        } else {

            var users = _.union(results.fromMajors || [], results.fromCompanies || [], results.fromAffinities || [], results.fromDepartments || []);
            UserAppController.getUsersFiltered(results.user.school, results.user.location, distance, minYear, maxYear, users, page, per_page)
                .then(function (usersFound) {
                    usersFound = usersFound.map(function (u) {
                        return u._id
                    });

                    ProfileController.getUsers(usersFound)
                        .then(function (usersFound) {
                            mixpanel.track("Filters Used");
                            return res.json({
                                users: usersFound
                            });
                        })
                        .fail(function (error) {
                            console.log(error);
                            return res.status(400).json(error);
                        });

                })
                .fail(function (error) {
                    console.log(error);
                    return res.status(400).json(error);
                });
        }

    };

    async.parallel(o, afterParallel);


};

SchoolController.getUsersFilteredfromAdmin = function (req, res) {
    var id = req.params.id;

    var distance = req.body.distance || 10;
    var minYear = req.body.min_year || 1970;
    var maxYear = req.body.max_year || 2019;
    var majors = req.body.majors || [];
    var companies = req.body.companies || [];
    var affinities = req.body.affinitygroups || [];
    var departments = req.body.departments || [];

    var users = [];


    var getMajorUsers = function (cb) {
        MajorController.getUsersByMajors(majors)
            .then(function (usersFound) {
                cb(null, usersFound);
            })
            .fail(function (error) {
                console.log(error);
                cb(error);
            });
    };

    var getCompanyUsers = function (cb) {
        CompanyController.getUsersByCompanies(companies)
            .then(function (usersFound) {
                cb(null, usersFound);
            })
            .fail(function (error) {
                console.log(error);
                cb(error);
            });
    };
    var getAffinityUsers = function (cb) {
        AffinityGroupController.getUsersByAffinities(affinities)
            .then(function (usersFound) {
                cb(null, usersFound);
            })
            .fail(function (error) {
                console.log(error);
                cb(error);
            });
    };
    var getDepartmentUsers = function (cb) {
        DepartmentController.getUsersByDepartments(departments)
            .then(function (usersFound) {
                cb(null, usersFound);
            })
            .fail(function (error) {
                console.log(error);
                cb(error);
            });
    };

    var o = {};

    // We may can validate the school too, and use the ID param that we are getting

    if (majors.length > 0) {
        o.fromMajors = getMajorUsers; // 1
    }

    if (companies.length > 0) {
        o.fromCompanies = getCompanyUsers; //2,1
    }

    if (affinities.length > 0) {
        o.fromAffinities = getAffinityUsers; //3, 2
    }

    if (departments.length > 0) {
        o.fromDepartments = getDepartmentUsers;
    }

    o.school = id;

    var afterParallel = function (e, results) {
        if (e) {
            return res.status(400).json(e);
        } else {

            var users = _.union(results.fromMajors || [], results.fromCompanies || [], results.fromAffinities || [], results.fromDepartments || []);
            UserAppController.getUsersFilteredfromAdmin(results.school, minYear, maxYear, users)
                .then(function (usersFound) {
                    usersFound = usersFound.map(function (u) {
                        return u._id
                    });

                    ProfileController.getUsers(usersFound)
                        .then(function (usersFound) {
                            return res.json({
                                users: usersFound
                            });
                        })
                        .fail(function (error) {
                            console.log(error);
                            return res.status(400).json(error);
                        });

                })
                .fail(function (error) {
                    console.log(error);
                    return res.status(400).json(error);
                });
        }

    };

    async.parallel(o, afterParallel);


};


