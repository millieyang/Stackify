'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Q = require('q');

/**
 * Place Schema
 */
var PlaceSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    url_logo: {
        type: String,
        trim: true,
        default: ''
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
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

mongoose.model('Place', PlaceSchema);
module.exports = mongoose.model('Place', PlaceSchema);
