'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Message = require('../models/message');


var MessageController = {};


module.exports = MessageController;

var Q = require('q');

var UserAppController = require('./userapp');