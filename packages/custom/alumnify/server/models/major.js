'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Q = require('q');

/**
 * Major Schema
 */
var MajorSchema = new Schema({
    major_name: {
        type: String,
        required: true,
        trim: true,
        unique: true // Should it be unique?
    },
    normalized_name: {
        type: String,
        trim: true,
        lowercase: true
    },
    school: {
        type: Schema.ObjectId,
        ref: 'School',
        required: true // CHANGE IT BACK TO TRUE!
    },
    users: {
        type: [{type: Schema.ObjectId, ref: 'UserApp'}],
        default: []
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User'
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


MajorSchema.methods.addUser = function (user) {
    var d = Q.defer();

    this.users = this.users || [];

    var exists = this.users.indexOf(user);

    if (exists !== -1) {
        d.reject({message: 'User already exists'});
    } else {

        this.users.push(user);
        this.last_update = new Date();

        this.save(function (e, majorUpdated) {
            if (e) {
                console.log(e);
                d.reject({message: 'Cant push the user to the major'});
            }else{
                d.resolve(majorUpdated);

            }
        });


    }


    return d.promise;
};

mongoose.model('Major', MajorSchema);
module.exports = mongoose.model('Major', MajorSchema);
