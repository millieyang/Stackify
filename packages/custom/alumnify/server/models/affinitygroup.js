'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Q = require('q');

/**
 * Affinity Group Schema
 */
var AffinityGroupSchema = new Schema({
    school: {
        type: Schema.ObjectId,
        ref: 'School',
        required: true
    },
    affinity_group_name: {
        type: String,
        required: true,
        trim: true
    },
    normalized_name: {
        type: String,
        trim: true,
        lowercase: true
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

mongoose.model('AffinityGroup', AffinityGroupSchema);
module.exports = mongoose.model('AffinityGroup', AffinityGroupSchema);