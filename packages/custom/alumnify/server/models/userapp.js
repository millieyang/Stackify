'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    Q = require('q');

/**
 * Profile Schema
 */
var UserAppSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        default: ''
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        default: ''
    },
    display_name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        trim: true,
        default: '',
        unique: true,
    },
    password: {
        type: String,
        default: ''
    },
    school: {
        type: Schema.ObjectId,
        ref: 'School'
    },
    salt: {
        type: String
    },

    connections: {
        type: [{
            user: {
                type: Schema.ObjectId,
                ref: 'UserApp'
            },
            creation_date: {
                type: Date
            }
        }],
        default: []
    },
    pending_connections: {
        type: [{
            user: {
                type: Schema.ObjectId,
                ref: 'UserApp'
            },
            request_date: {
                type: Date
            }
        }],
        default: []
    },
    grad_year: {
        type: Number,
        default: 1900
    },
    location: {
        type: [Number],
        index: '2d'
    },

    active: {
        type: Boolean,
        default: true
    },
    date_inactive: {
        type: Date
    },

    //TODO: SURVEY - MAJORS
    date_created: {
        type: Date
    },
    last_update: {
        type: Date
    },

    provider: {
        type: String,
        //required: 'Provider is required'
    },

    providerData: {},

    additionalProvidersData: {},

    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin']
        }],
        default: ['user']
    },
    profile: {
        type: Schema.ObjectId,
        ref: 'Profile'
    },
    /* File handling */
    notifications: {
        type: [Schema.ObjectId],
        ref: 'Notification',
        default: []
    },
    enableNotifications: {
        type: Boolean,
        default: true
    },
    /* For reset password */
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    reported: {
        type: Boolean,
        default: false
    }
});

/**
 * Statics
 */
UserAppSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb); //Shouldnt be this profile?
};

UserAppSchema.statics.makeSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};
UserAppSchema.statics.hashPassword = function (password, salt) {
    if (!password || !salt) return '';
    var _salt = new Buffer(salt, 'base64');
    return crypto.pbkdf2Sync(password, _salt, 10000, 64).toString('base64');
};

var createAndPopulate = function (o, filter) {
    var d = Q.defer();


    UserAppSchema.create(o, function (e, userCreated) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant create the profile'});
        } else {
            self.populate(userCreated, {path: 'user', model: 'User', select: filter}, function (er, userPopulated) {
                if (er) {
                    console.log(er);
                    d.reject({message: 'Cant populate the user'});
                } else {
                    d.resolve(userPopulated);
                }
            });
        }
    });

    return d.promise;
};

UserAppSchema.statics.getOrCreate = function (id, filter) {
    var d = Q.defer();

    filter = filter || '_id name username';

    var self = this;
    var query = this.findOne({user: id});
    query.populate({path: 'user', model: 'User', select: filter});
    query.exec(function (e, userFound) {
        if (e) {
            d.reject(e);
        } else {
            if (userFound === null) {
                createAndPopulate({user: id, date_created: new Date()}, filter)
                    .then(function (userCreated) {
                        d.resolve(userCreated);
                    })
                    .fail(function (error) {
                        d.reject(error);
                    });
            } else {
                d.resolve(userFound);
            }
        }
    });

    return d.promise;
};

UserAppSchema.methods.connected = function (id) {
    var d = Q.defer();

    this.connections = this.connections || [];

    var connected = false;
    this.connections.forEach(function (c) {
        if (connected) {
            return;
        }

        var cStr = ''.concat(c.user);
        var idStr = ''.concat(id);

        if (cStr === idStr) {
            connected = true;
        }

    });


    d.resolve(connected);


    return d.promise;
};


UserAppSchema.methods.createRequest = function (requester) {
    var d = Q.defer();
    this.connected(requester)
        .then(function (connected) {
            if (connected) {
                d.reject({messaqge: 'Users already connected'});
            } else {
                // Check if it is pending already
                var pending = false;
                this.pending_connections = this.pending_connections || [];
                this.pending_connections.forEach(function (pc) {
                    if (pending) {
                        return;
                    }
                    var pcStr = ''.concat(pc.user);
                    var rStr = ''.concat(requester);
                    if (pcStr === rStr) {
                        pending = true;
                    }
                });

                if (pending) {
                    d.reject({messag: 'Already exists a request'});
                } else {

                    this.pending_connections.push({user: requster, request_date: new Date()});
                    this.save(function (e, updated) {
                        if (e) {
                            console.log(e);
                            d.reject({message: 'Cant create the request'});
                        } else {
                            d.resolve(true);
                        }
                    });
                }
            }
        });
    return d.promise;
};

mongoose.model('UserApp', UserAppSchema);
module.exports = mongoose.model('UserApp', UserAppSchema);