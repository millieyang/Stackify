'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Message = require('../../models/message');

var MessageController = require('../message');
module.exports = MessageController;
var Q = require('q');

var UserAppController = require('./userapp');


var ConversationController = require('./conversation');

MessageController.getConversation = function (req, res) {
    var user_a = req.params.a;
    var user_b = req.params.b;


    ConversationController.getOrCreate(user_a, user_b)
        .then(function (conversationFound) {
            var query = Message.find({
                conversation: conversationFound._id
            });

            // TODO Add Pagination
            // TODO Add Sort

            query.sort({date_created: -1});

            query.exec(function (e, messagesFound) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Cant get messages'});
                } else {
                    return res.json({messages: messagesFound});
                }
            });


        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });
};

MessageController.create = function (req, res) {
    var from = req.params.from;
    var to = req.params.to;
    var _message = req.body.message;

    ConversationController.getOrCreate(from, to)
        .then(function (conversationFound) {
            var o = {};
            o.conversation = conversationFound._id;
            o.sender = from;
            o.message = _message.trim();

            Message.create(o, function (e, messageCreated) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Cant create the message'});
                }

                UserAppController.getById(messageCreated.sender)
                    .then(function (userFound) {
                        SchoolController.getById(userFound.school)
                            .then(function (schoolFound) {
                                schoolFound.message_count += 1;
                                schoolFound.last_update = new Date();
                                schoolFound.save(function (er, schoolUpdated) {
                                    if (er) {
                                        console.log(er);
                                        return res.status(400).json({message: 'Cannot update message count'});
                                    }
                                });
                            })
                            .fail(function (error) {
                                console.log(error);
                                return res.status(400).json(error);
                            });
                    })
                    .fail(function (error) {
                        console.log(error);
                        return res.status(400).json(error);
                    });

                conversationFound.last_message = messageCreated._id;
                conversationFound.last_update = new Date();
                conversationFound.save(function (er, conversationUpdated) {
                    if (er) {
                        console.log(er);
                        return res.status(400).json({message: 'Message created but wasnt added to the conversation'});
                    }
                    mixpanel.track("Message Sent");
                    return res.json({message: messageCreated});
                });


            });

        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });
};


