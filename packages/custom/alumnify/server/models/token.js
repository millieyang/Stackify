'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Q = require('q');

/**
 * Meetup Schema
 */
var TokenSchema = new Schema({

    _id: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: Schema.ObjectId,
        required: true
    },
    date_created: {
        type: Date,
        required: true,
        expires: '5h'
    }
});

/**
 * Validations
 */


/**
 * Statics
 */

mongoose.model('Token', TokenSchema);
module.exports = mongoose.model('Token', TokenSchema);
