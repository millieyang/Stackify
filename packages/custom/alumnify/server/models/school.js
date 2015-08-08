'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Q = require('q');


/**
 * School Schema
 */
var SchoolSchema = new Schema({
    school_name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    normalized_name: {
        type: String,
        trim: true,
        lowercase: true
    },
    school_color: {
        type: String,
        trim: true,
        required: true
    },
    school_logo: {
        type: String,
        trim: true,
        default: ''
    },

    school_app_name: {
        type: String,
        trim: true,
        required: true
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    school_location: {
        type: String
    },

    companies: {
        type: [{type: Schema.ObjectId, ref: 'Company'}],
        default: []
    },
    departments: {
        type: [{type: Schema.ObjectId, ref: 'Department'}],
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
    users: {
        type: [{type: Schema.ObjectId, ref: 'UserApp'}],
        default: []
    },
    user_count: {
        type: Number,
        default: 0
    },
    connection_count: {
        type: Number,
        default: 0
    },
    message_count: {
        type: Number,
        default: 0
    },
    meetup_count: {
        type: Number,
        default: 0
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

mongoose.model('School', SchoolSchema);
module.exports = mongoose.model('School', SchoolSchema);
