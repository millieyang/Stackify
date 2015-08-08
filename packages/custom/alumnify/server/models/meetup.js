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
var MeetupSchema = new Schema({

    // false
    personal: {
        type: Boolean,
        default: true
    },

    sender_user: {
        type: Schema.ObjectId,
        ref: 'UserApp',
        required: true
    },
    receiver_user: {
        type: Schema.ObjectId,
        ref: 'UserApp',
        required: true
    },
    place: {
        type: Schema.ObjectId,
        ref: 'Location'
    },
    potential_dates: {
        type: [{type: Date}],
        default: []
    },

    meetup_date: {
        type: Date
    },

    via: {
        type: String,
        enum: ['skype', 'google', 'call']
    },

    sender_id: {
        type: String, // Should store the Skype ID, Gmail account, or phone number
        default: ''
    },

    purpose: {
        type: String,
        trim: true,
        default: ''
    },

    receiver_id: {
        type: String,
        default: ''
    },

    confirmed: {
        type: Boolean,
        default: false
    },

    canceled: {
        type: Boolean,
        default: false
    },
    canceled_by: {
        type: Schema.ObjectId,
        ref: 'UserApp'
    },

    confirmation_date: {
        type: Date
    },

    date_created: {
        type: Date
    }
    ,
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

mongoose.model('Meetup', MeetupSchema);
module.exports = mongoose.model('Meetup', MeetupSchema);
