'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Conversation = require('../models/conversation');

var ConversationController = {};
var Q = require('q');

var UserAppController = require('./userapp');

module.exports = ConversationController;