'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Q = require('q');

/**
 * Department Schema
 */
var DepartmentSchema = new Schema({
    department_name: {
        type: String,
        trim: true
    },
    normalized_name: {
        type: String,
        trim: true,
        lowercase: true
    },
    school: {
        type: Schema.ObjectId,
        ref: 'School',
        require: true
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


mongoose.model('Department', DepartmentSchema);
module.exports = mongoose.model('Department', DepartmentSchema);
