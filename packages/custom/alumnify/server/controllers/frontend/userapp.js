'use strict';

//Mixpanel
var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init('5e93ef4cedc005541c1e44b5bd28c405');

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    UserApp = require('../../models/userapp');

var config = require('meanio').loadConfig();

var UserAppController = require('../userapp');
module.exports = UserAppController;

var Q = require('q');
var ProfileController = require('./profile');
var SchoolController = require('./school');
var NotificationController = require('./notification');
var async = require('async');
var jwt = require('jsonwebtoken');
var TokenController = require('../token');
var iv = require('../../utils/idvalidator');


UserAppController.create = function (req, res) {
    // var _school = req.body.userapp.school;
    var _user = req.body.userapp;


    //Validation for each field
    if (typeof (_user.first_name) === 'undefined') {
        return res.status(400).json({message: 'First name is required'});
    }

    if (typeof (_user.last_name) === 'undefined') {
        return res.status(400).json({message: 'Lastn ame name is required'});
    }

    if (typeof (_user.email) === 'undefined') {
        return res.status(400).json({message: 'Email is required'});
    }


    if (_user.first_name.length <= 0) {
        return res.status(400).json({message: 'First name is required'});
    }

    if (_user.last_name.length <= 0) {
        return res.status(400).json({message: 'Last name is required'});
    }

    if (_user.email.length <= 0) {
        return res.status(400).json({message: 'Email is required'});
    }


    SchoolController.getById(_user.school)
        .then(function (schoolFound) {
            var o = {};

            o.first_name = _user.first_name.trim();
            o.last_name = _user.last_name.trim();
            o.display_name = o.first_name;
            o.email = _user.email.trim();

            o.school = schoolFound._id;
            o.date_created = new Date();

            o.salt = UserApp.makeSalt();
            o.password = UserApp.hashPassword(_user.password.trim(), o.salt);

            UserApp.create(o, function (e, userCreated) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Cant create the User at this moment'});
                }

                if (typeof(schoolFound.users) === 'undefined') {
                    schoolFound.users = [];
                }

                schoolFound.users.push(userCreated._id);
                schoolFound.user_count += 1;
                schoolFound.last_update = new Date();
                schoolFound.save(function (er, schoolUpdated) {
                    if (er) {
                        console.log(er);
                        return res.status(400).json({message: 'User created but cand be added to the School'});
                    }
                    mixpanel.track("New UserApp Created", {
                        school: schoolFound.school_name
                    });


                    ProfileController._getOrCreate(userCreated._id)
                        .then(function (profileFound) {
                        })
                        .fail(function (error) {
                        });

                    return res.json({userapp: userCreated});
                });


            });


        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });

};


UserAppController.setMajors = function (req, res) {
    var user = req.userapp;
    var majors = req.body.majors || [];

    ProfileController.getById(user)
        .then(function (userFound) {
            var each = function (m, cb) {
                ProfileController.handleMajor(userFound._id, m)
                    .then(function (added) {
                        cb(null);
                    })
                    .fail(function (error) {
                        cb(error);
                    });
            };

            var after = function (e) {
                if (e) {
                    console.log(e);
                    return res.status(400).json(e);
                }
                return res.json({added: true});
            };
            async.each(majors, each, major);

        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });
};


UserAppController.getNearest = function (school, user, page, qty) {
    var d = Q.defer();

    var maxDistance = 5; // 5KM
    maxDistance /= 6371;

    var query = UserApp.find({
        active: true,
        school: school,
        location: {
            $near: user.location, // [-64.44445, 7.6464]
            $maxDistance: maxDistance
        }
    });


    query.where('_id').nin(user.connections);

    query.skip((page - 1) * qty).limit(qty);


    query.exec(function (e, usersFound) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant get users at this moment'});
        } else {
            d.resolve(usersFound);
        }
    });


    return d.promise;
};


UserAppController.getUsersFiltered = function (school, location, distance, minYear, maxYear, users, page, qty) {
    var d = Q.defer();

    var query = UserApp.find({
        active: true,
        school: school,
        grad_year: {"$gte": minYear, "$lte": maxYear},
        location: {
            $near: location,
            $maxDistance: distance
        }
    });
    query.where('_id').in(users);
    query.select('_id');

    query.skip((page - 1) * qty).limit(qty);
    query.exec(function (e, usersFound) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant get users'});
        } else {
            d.resolve(usersFound);
        }
    });


    return d.promise;
};

UserAppController.getUsersFilteredfromAdmin = function (school, minYear, maxYear, users) {
    var d = Q.defer();

    var query = UserApp.find({
        active: true,
        school: school,
        grad_year: {"$gte": minYear, "$lte": maxYear}
    });
    query.where('_id').in(users);
    query.select('_id');

    query.exec(function (e, usersFound) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant get users'});
        } else {
            d.resolve(usersFound);
        }
    });

    return d.promise;
};


UserAppController.setGradYear = function (req, res) {
    var user = req.userapp;
    var year = req.params.year;


    UserAppController.getById(user)
        .then(function (userFound) {
            userFound.grad_year = year.trim();
            userFound.last_update = new Date();
            userFound.save(function (e, userUpdated) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Cant update the grad year'});
                }
                mixpanel.track("Edited UserApp", {category: "Grad Year"});
                return res.json({user: userUpdated});
            });
        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });
};

UserAppController.updateInfo = function (req, res) {
    var id = req.userapp;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;

    UserAppController.getById(id)
        .then(function (userFound) {
            userFound.first_name = first_name.trim();
            userFound.last_name = last_name.trim();
            userFound.last_update = new Date();
            userFound.save(function (e, userUpdated) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({
                        message: 'Cant update the user'
                    });
                }
                mixpanel.track("Edited UserApp", {category: "Basic Info"});
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


UserAppController.reportUser = function (req, res) {
    var _report = req.body.user;

    UserAppController.getById(_report._id)
        .then(function (userFound) {
            userFound.reported = true;
            userFound.last_update = new Date();
            userFound.save(function (e, userUpdated) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({
                        message: 'Cant report the user'
                    });
                }
                mixpanel.track("Reported UserApp");
                return res.json({
                    reported: true
                });
            });
        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });
};


var _getConnections = function (id) {

    var d = Q.defer();

    UserAppController.getById(id)
        .then(function (userFound) {
            var a = UserApp.aggregate();
            a.match({
                _id: userFound._id
            });

            a.unwind('connections');

            a.sort({
                'connections.creation_date': -1
            });

            a.group({
                _id: 0,
                users: {
                    $addToSet: '$connections.user'
                }
            });

            a.exec(function (e, data) {
                if (e) {
                    console.log(e);
                    d.reject({message: 'Cant get connections'});
                } else {
                    if (data.length > 0) {
                        d.resolve(data[0].users || []);
                    } else {
                        d.resolve([]);
                    }
                }
            });

        })
        .fail(function (error) {
            d.reject(error);
        });

    return d.promise;
};


UserAppController.getConnections = function (req, res) {
    var id = req.userapp;

    if (!iv.isValid(id)) {
        return res.status(400).json({message: 'Invalid User ID'});
    }

    _getConnections(id)
        .then(function (userIds) {
            ProfileController.getUsers(userIds)
                .then(function (connections) {
                    return res.json({connections: connections});
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

UserAppController.getConnectionsfromAdmin = function (req, res) {
    var id = req.params.id;

    if (!iv.isValid(id)) {
        return res.status(400).json({message: 'Invalid User ID'});
    }

    _getConnections(id)
        .then(function (userIds) {
            ProfileController.getUsers(userIds)
                .then(function (connections) {
                    return res.json({connections: connections});
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

UserAppController.requestConnection = function (req, res) {
    var user = req.userapp;
    var target = req.params.target;

    if (!iv.isValid(user) || !iv.isValid(target)) {
        return res.status(400).json({message: 'Invalid User ID'});
    }

    var bothExists = false;

    var checkUser = function (cb) {
        UserAppController.getById(user)
            .then(function (userFound) {
                cb(null, userFound);
            })
            .fail(function (error) {
                cb(error);
            });
    };

    var checkTarget = function (cb) {
        UserAppController.getById(target)
            .then(function (userFound) {
                cb(null, userFound);
            })
            .fail(function (error) {
                cb(error);
            });
    };

    var after = function (e, results) {
        if (e) {
            console.log(e);
            return res.status(400).json(e);
        }

        results.target.createRequest(results.user._id)
            .then(function (created) {

                //After the request is created we create the notification
                var o = {};
                o.reference = 'connect';
                o.receiver_user = results.target._id;
                o.sender_user = results.user._id;
                o.kind = 'invite';
                o.date_created = new Date();

                NotificationController.create(o)
                    .then(function (notificationCreated) {
                        mixpanel.track("Connection Requested");
                        // TODO  Send the notification to the user app


                    })
                    .fail(function (error) {
                        // TODO: Store the error into a log for the admins maybe?
                        console.log(error);
                    });

                return res.json({request_crated: created});


            })
            .fail(function (error) {
                console.log(error);
                return res.status(400).json(error);
            });


    };


    async.parallel({
        user: checkUser,
        target: checkTarget
    }, after);


};


UserAppController.confirmConnection = function (req, res) {
    var user = req.userapp; // User Logged
    var request = req.params.request;

    UserAppController.getById(user)
        .then(function (userFound) {

            userFound.pending_connections = userFound.pending_connections || [];

            var r = userFound.pending_connections.id(request);

            if (typeof(r) === 'undefined') {
                return res.status(400).json({message: 'Request doesnt exists'});
            }


            var o = {};
            o.user = r.user;
            var requester = o.user;
            o.creation_date = new Date();
            userFound.connectons = userFound.connectons || [];

            userFound.connections.push(o);
            schoolFound.connection_count += 1;
            r.remove(); // Remove from pending
            userFound.last_update = new Date();
            userFound.save(function (e, userUpdated) {
                if (e) {
                    console.log(e);

                    return res.status(400).json({message: 'Cant confirm the request at this moment'});
                }
                SchoolController.getById(userFound.school)
                    .then(function (schoolFound) {
                        schoolFound.connection_count += 1;
                        schoolFound.last_update = new Date();
                        schoolFound.save(function (er, schoolUpdated) {
                            if (er) {
                                console.log(er);
                                return res.status(400).json({message: 'Cannot update connection count'});
                            }
                        });
                    });

                UserAppController.getById(requester)
                    .then(function (requesterFound) {
                        requesterFound.connections = requesterFound.connections || [];
                        requesterFound.connections.push({user: userFound.id, creating_date: new Date()});
                        requesterFound.last_update = new Date();

                        requesterFound.save(function (er, requesterUpdated) {
                            if (er) {
                                console.log(er);
                                return res.status(400).json({message: 'Cant confirm the request at this moment'});
                            }


                            NotificationController.getConnection(requester, userFound._id)
                                .then(function (notificationFound) {
                                    notificationFound.active = false;
                                    notificationFound.last_update = new Date();
                                    notificationFound.save(function (err, notificationUpdated) {
                                        if (err) {
                                            return console.log(err);
                                        }


                                        var o = {};
                                        o.reference = 'connect';
                                        o.receiver_user = notificationUpdated.sender_user;
                                        o.sender_user = notificationUpdated.receiver_user;
                                        o.kind = 'accept';
                                        o.date_created = new Date();


                                        NotificationController.create(o)
                                            .then(function (notificationCreated) {
                                                mixpanel.track("Connection Confirmed");
                                                // TODO: SEND THE NOTIFICATION TO THE USER
                                            })
                                            .fail(function (error) {
                                                console.log(error);
                                            });
                                    });
                                });


                            return res.json({confirmed: true});
                        });
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

UserAppController.login = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (typeof(username) === 'undefined' || typeof(password) === 'undefined') {
        return res.status(400).json({message: 'Username and/or password missing'});
    }
    var query = UserApp.findOne({
        email: username.trim()
    });

    query.select('_id email password salt');

    query.exec(function (e, userFound) {
        if (e) {
            console.log(e);
            return res.status(400).json({message: 'Cant query user'});
        }


        if (userFound.password === UserApp.hashPassword(password, userFound.salt)) {
            //Creates the token

            var payload = userFound;
            payload.date_created = new Date();
            var escaped = JSON.stringify(payload);
            escaped = encodeURI(escaped);
            // We are sending the payload inside the token
            var token = jwt.sign(escaped, config.secret, {expiresInMinutes: 60 * 2});

            TokenController.create(token, userFound._id)
                .then(function (tokenCreated) {
                    res.json({token: tokenCreated});
                })
                .fail(function (error) {
                    console.log(error);
                    res.status(400).json(error);
                });

        } else {
            res.status(400).json({message: 'Username and/or the password provided doesnt match'});
        }
    });
};


UserAppController.me = function (req, res) {
    var user = req.userapp;

    UserAppController.getById(user)
        .then(function (userFound) {
            res.json({user: userFound});
        })
        .fail(function (error) {
            console.log(error);
            res.status(400).json(error);

        });
};


UserAppController.setInactive = function (req, res) {
    var user = req.userapp;

    UserAppController.getById(user)
        .then(function (userFound) {
            userFound.active = false;
            userFound.date_inactive = new Date();

            userFound.save(function (e, userUpdated) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Cant update the user'});
                }
                return res.json({inactive: true});
            });


        })
        .fail(function (error) {
            console.log(e);
            return res.status(400).json(error);

        });


};


