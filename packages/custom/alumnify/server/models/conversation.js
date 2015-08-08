'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Q = require('q');

/**
 * Conversation Schema
 */
var ConversationSchema = new Schema({

    user_a: {
        type: Schema.ObjectId,
        ref: 'UserApp',
        required: true
    },
    user_b: {
        type: Schema.ObjectId,
        ref: 'UserApp',
        required: true
    },

    date_created: {
        type: Date
    },
    last_message: {
        type: Schema.ObjectId,
        ref: 'Message'
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

mongoose.model('Conversation', ConversationSchema);
module.exports = mongoose.model('Conversation', ConversationSchema);
