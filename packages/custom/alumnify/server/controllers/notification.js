'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Notification = require('../models/notification');


var NotificationController = {};

module.exports = NotificationController;


var Q = require('q');

var UserAppController = require('./userapp');