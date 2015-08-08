'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Q = require('q');

/**
 * Notification Schema
 */
var NotificationSchema = new Schema({
    //TODO to fill the fields that needed
    //connect, meet up, call
    reference: {
        type: String,
        trim: true,
        enum: ['connect', 'meetup'],
        required: true
    },
    reference_meetup: {
        type: Schema.ObjectId,
        ref: 'Meetup'
    },

    sender_user: {
        type: Schema.ObjectId,
        ref: 'UserApp'
    },
    receiver_user: {
        type: Schema.ObjectId,
        ref: 'UserApp',
        required: true
    },
    //cancel, invite, accept
    kind: {
        type: String,
        enum: ['cancel', 'invite', 'accept'],
        required: true
    },
    //true: not seen   false: seen
    active: {
        type: Boolean,
        default: true,
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


mongoose.model('Notification', NotificationSchema);
module.exports = mongoose.model('Notification', NotificationSchema);
