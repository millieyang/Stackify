'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Q = require('q');

/**
 * Message Schema
 */
var MessageSchema = new Schema({

    conversation: {
        type: Schema.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: Schema.ObjectId,
        ref: 'UserApp',
        required: true
    },
    message: {
        type: String,
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

mongoose.model('Message', MessageSchema);
module.exports = mongoose.model('Message', MessageSchema);
