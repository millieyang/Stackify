'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Conversation = require('../../models/conversation');


var ConversationController = require('../conversation');
module.exports = ConversationController;
var Q = require('q');

var UserAppController = require('./userapp');

ConversationController.getOrCreate = function (user_a, user_b) {
    var d = Q.defer();
    var query = Conversation.findOne({});
    query.or([
        {$and: [{user_a: user_a}, {user_b: user_b}]},
        {$and: [{user_a: user_b}, {user_b: user_a}]}
    ]).exec(function (e, conversationFound) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant query conversations at this moment'});
        } else {
            if (conversationFound !== null) {
                d.resolve(conversationFound);
            } else {
                var o = {};
                o.user_a = user_a;
                o.user_b = user_b;
                o.date_created = new Date();
                Conversation.create(o, function (er, conversationCreated) {
                    if (er) {
                        console.log(er);
                        d.reject({message: 'Cant create the conversation'});
                    } else {
                        d.resolve(conversationCreated);
                    }
                });
            }
        }
    });
    return d.promise;
};

ConversationController.get = function (req, res) {
    var user = req.userapp;

    var query = Conversation.find({});

    query.or({user_a: user}, {user_b: user});
    query.populate({path: 'user_a', model: 'UserApp', select: '_id first_name'});
    query.populate({path: 'user_b', model: 'UserApp', select: '_id first_name'});
    query.populate({path: 'last_message', model: 'Message'});

    query.sort({last_update: -1});

    query.exec(function (e, conversationsFound) {
        if (e) {
            console.log(e);
            return res.status(400).json({message: 'Cant get list of conversations'});
        }
        return res.json({conversations: conversationsFound});
    });
};


