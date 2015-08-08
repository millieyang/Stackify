'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Q = require('q');

/**
 * Profile Schema
 */
var ProfileSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'UserApp',
        unique: true
    },
    profile_pic: {
        type: String,
        trim: true,
        default: ''
    },

    display_name: {
        type: String,
        trim: true,
        default: ''
    },

    about: {
        type: String,
        trim: true,
        default: ''
    },
    company_department: {
        type: [{
            company: {
                type: Schema.ObjectId,
                ref: 'Company'
            },
            department: {
                type: Schema.ObjectId,
                ref: 'Department'
            },
            date_added: {
                type: Date
            }
        }],
        default: []
    },
    majors: {
        type: [{type: Schema.ObjectId, ref: 'Major'}],
        default: []
    },
    affinity_groups: {
        type: [{type: Schema.ObjectId, ref: 'AffinityGroup'}],
        default: []
    },
    date_created: {
        type: Date
    },
    last_update: {
        type: Date
    }
});

/**
 * Validations
 */


/**
 * Statics
 */
ProfileSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

ProfileSchema.statics.createAndPopulate = function (o, filter) {
    var d = Q.defer();
    var self = this;

    this.create(o, function (e, profileCreated) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant create the profile'});
        } else {


            self.populate(profileCreated, {
                path: 'user',
                model: 'UserApp',
                select: filter
            }, function (er, profilePopulated) {
                if (er) {
                    console.log(er);
                    d.reject({message: 'Cant populate the profile'});
                } else {
                    d.resolve(profilePopulated);
                }
            });
        }
    });

    return d.promise;
};

ProfileSchema.statics.getOrCreate = function (id, filter) {
    var d = Q.defer();


    filter = filter || '_id first_name last_name';

    var self = this;
    var query = this.findOne({user: id});
    query.populate({path: 'user', model: 'UserApp', select: filter});
    query.exec(function (e, profileFound) {
        if (e) {
            d.reject(e);
        } else {
            if (profileFound === null) {
                self.createAndPopulate({user: id, date_created: new Date()}, filter)
                    .then(function (profileCreated) {
                        d.resolve(profileCreated);
                    })
                    .fail(function (error) {
                        d.reject(error);
                    });
            } else {
                d.resolve(profileFound);
            }
        }
    });

    return d.promise;
};


/**
 * Methods
 */


ProfileSchema.methods.addCompany = function (oCompany) {
    var d = Q.defer();

    if (typeof(this.company_department) === 'undefined') {
        this.company_department = [];
    }

    var exists = false;

    this.company_department.forEach(function (cd) {
        if (exists) {
            return;
        }
        var cString = cd.company;
        var dString = cd.department;

        if (cString === oCompany.company && dString === oCompany.department) {
            exists = true;
        }
    });


    if (exists) {
        d.reject({message: 'Company-Department already exists'});
    } else {
        this.company_department.push(oCompany);
        this.last_update = new Date();
        this.save(function (e, profileUpdated) {
            if (e) {
                console.log(e);
                d.reject({message: 'Cant add the Company-Department at this moment'});
            } else {
                d.resolve(profileUpdated);
            }
        });
    }


    return d.promise;
};


ProfileSchema.methods.addMajor = function (major) {
    var d = Q.defer();

    this.majors = this.majors || [];


    var exists = this.majors.indexOf(major);


    if (exists !== -1) {
        d.reject({message: 'Major already exists'});
    } else {
        this.majors.push(major);
        this.last_update = new Date();

        this.save(function (e, profileUpdated) {
            if (e) {
                console.log(e);
                d.reject({message: 'Cant add the major to the profiel'});

            } else {
                d.resolve(profileUpdated);
            }
        });
    }


    return d.promise;

};


mongoose.model('Profile', ProfileSchema);
module.exports = mongoose.model('Profile', ProfileSchema);

