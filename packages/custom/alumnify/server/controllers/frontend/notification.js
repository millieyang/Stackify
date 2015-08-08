'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Notification = require('../../models/notification');


var NotificationController = require('../notification');

module.exports = NotificationController;

var Q = require('q');

var UserAppController = require('./userapp');

NotificationController.create = function (o) {
    var d = Q.defer();
    Notification.create(o, function (e, notificationCreated) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant create the notification'});
        } else {
            d.resolve(notificationCreated);
        }
    });

    return d.promise;
};

NotificationController.getByUser = function (req, res) {
    var user = req.userapp;

    UserAppController.getById(user)
        .then(function (userFound) {
            var query = Notification.find({
                receiver_user: userFound._id,
                active: true
            });

            query.populate({path: 'reference_meetup', model: 'Meetup'});
            query.populate({path: 'sender_user', model: 'UserApp'});
            query.populate({path: 'receiver_user', model: 'UserApp'});

            query.exec(function (e, notificationsFound) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Cant get notifications'});
                }

                return res.json({notifications: notificationsFound});
            });


        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });

};

NotificationController.getByUserforAdmin = function (req, res) {
    var user = req.params.id;

    UserAppController.getById(user)
        .then(function (userFound) {
            var query = Notification.find({
                $or: [
                    {receiver_user: userFound._id},
                    {sender_user: userFound._id}
                ]
            });

            query.populate({path: 'reference_meetup', model: 'Meetup'});
            query.populate({path: 'sender_user', model: 'UserApp'});
            query.populate({path: 'receiver_user', model: 'UserApp'});

            query.exec(function (e, notificationsFound) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Cant get notifications'});
                }

                return res.json({notifications: notificationsFound});
            });


        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });

};


NotificationController.getConnection = function (sender, receiver) {
    var d = Q.defer();

    var query = Notification.findOne({
        reference: 'connect',
        active: true,
        sender_user: sender,
        receiver_user: receiver,
        kind: 'invite'
    });

    query.exec(function (e, notificationFound) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant get the notification'});
        } else {
            if (notificationFound === null) {
                d.reject({message: 'Notification doesnt exists'});
            } else {
                d.resolve(notificationFound);
            }
        }
    });


    return d.promise;
};


NotificationController.getMeetup = function (sender, receiver) {
    var d = Q.defer();

    var query = Notification.findOne({
        reference: 'meetup',
        active: true,
        sender_user: sender,
        receiver_user: receiver,
        kind: 'invite'
    });

    query.exec(function (e, notificationFound) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant get the notification'});
        } else {
            if (notificationFound === null) {
                d.reject({message: 'Notification doesnt exists'});
            } else {
                d.resolve(notificationFound);
            }
        }
    });


    return d.promise;
};
