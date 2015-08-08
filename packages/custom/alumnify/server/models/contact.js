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
var ContactSchema = new Schema({
    school: {
        type: Schema.ObjectId,
        ref: 'School',
        required: true
    },
    via: {
        type: String,
        enum: ['adminpanel', 'ios', 'android']
    },
    message: {
        type: String,
        required: true
    }
});

/**
 * Validations
 */


/**
 * Statics
 */

mongoose.model('Contact', ContactSchema);
module.exports = mongoose.model('Contact', ContactSchema);