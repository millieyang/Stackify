'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Q = require('q');

/**
 * Company Schema
 */
var CompanySchema = new Schema({

    company_name: {
        type: String,
        unique: true,
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

    school: {
        type: Schema.ObjectId,
        ref: 'School',
        required: true
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    user_created: {
        type: Boolean,
        default: false
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

mongoose.model('Company', CompanySchema);
module.exports = mongoose.model('Company', CompanySchema);
