'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),

    ObjectId = mongoose.Types.ObjectId,
    Meetup = require('../../models/meetup');

var MeetupController = require('../meetup');
module.exports = MeetupController;

var Q = require('q');

var async = require('async');

var UserAppController = require('./userapp');

var NotificationController = require('./notification');


MeetupController.create = function (req, res) {
    var oMeetup = req.body.meetup;

    var o = {};

    o.personal = oMeetup.personal;
    o.sender_user = oMeetup.sender;
    o.receiver_user = oMeetup.receiver;
    o.purpose = oMeetup.purpose.trim()
    if (o.personal) {
        o.place = oMeetup.place;
    } else {
        o.via = oMeetup.via.trim().toLowerCase();
        o.sender_id = oMeetup.sender_id.trim();
    }


    // 15/07/2015 10:00 TZ -> 1231234568456
    //
    //
    // oMeetup.dates = ["1231234568456", "1231234568456", "1231234568456", "1231234568456"]
    o.potential_dates = oMeetup.dates.map(function (d) {
        return new Date(d);
    });

    o.date_created = new Date();

    Meetup.create(o, function (e, meetupCreated) {
        if (e) {
            console.log(e);
            return res.status(400).json({message: 'Cant create the meetup'});
        }
        schoolFound.meetup_count += 1;
        var o = {};
        o.reference = 'meetup';
        o.reference_meetup = meetupCreated._id;
        o.sender_user = meetupCreated.sender_user;
        o.receiver_user = meetupCreated.receiver_user;
        o.kind = 'invite';
        o.date_created = new Date();
        NotificationController.create(o)
            .then(function (notificationCreated) {
                mixpanel.track("Meetup Requested");
                //
            })
            .fail(function (error) {
                console.log(error);
            });
        return res.json({meetup: meetupCreated});
    });
};

MeetupController.confirm = function (req, res) {
    var id = req.params.id; // meetup id
    var receiver = req.params.receiver;
    var date = req.body.date; // Position of the date -> [sadasd, asdsad, ] 1
    date = parseInt(date);

    var receiver_id = req.body.receiver_id || '';


    MeetupController.getById(id)
        .then(function (meetupFound) {
            if (meetupFound.receiver_user === (new ObjectId(receiver))) {

                if (type(meetupFound.potential_dates[date]) === 'undefined') {
                    return res.status(400).json({message: 'Invalid meetup date'});
                }

                if (!meetupFound.personal) {
                    meetupFound.receiver_id = receiver_id.trim();
                }


                meetupFound.confirmation_date = new Date();
                meetupFound.last_update = new Date();
                meetupFound.confirmed = true;
                meetupFound.meetup_date = meetupFound.potential_dates[date];

                meetupFound.save(function (e, meetupUpdated) {
                    if (e) {
                        console.log(e);
                        return res.status(400).json({message: 'Cant confirm the meetup at this moment'});
                    }

                    UserAppController.getById(meetupFound.sender_user)
                        .then(function (userFound) {
                            SchoolController.getById(userFound.school)
                                .then(function (schoolFound) {
                                    schoolFound.meetup_count += 1;
                                    schoolFound.last_update = new Date();
                                    schoolFound.save(function (er, schoolUpdated) {
                                        if (er) {
                                            console.log(er);
                                            return res.status(400).json({message: 'Cannot update meetup count'});
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

                    // Get the current notification and cancelling it
                    NotificationController.getMeetup(meetupUpdated.sender_user, meetupUpdated.receiver_user)
                        .then(function (notificationFound) {

                            notificationFound.active = false;
                            notificationFound.last_update = new Date();

                            notificationFound.save(function (er, notificationUpdated) {
                                if (er) {
                                    console.log(er);
                                } else {
                                    var o = {};
                                    o.reference = 'meetup';
                                    o.reference_meetup = meetupUpdated._id;
                                    o.sender_user = meetupUpdated.receiver_user;
                                    o.receiver_user = meetupUpdated.sender_user;
                                    o.kind = 'accept';
                                    o.date_created = new Date();
                                    NotificationController.create(o)
                                        .then(function (notificationCreated) {
                                            mixpanel.track("Meetup Confirmed");
                                        })
                                        .fail(function (error) {
                                            console.log(error);
                                        });
                                }

                            });


                        })
                        .fail(function (error) {
                            console.log(error);
                        });


                    return res.json({confirmed: true, meetup: meetupUpdated});
                });


            } else {
                return res.status(400).json({message: 'The receiver doesnt have permissions on this meetup'});
            }

        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });
};

MeetupController.getMeetupsByUser = function (req, res) {
    var id = req.userapp;

    UserAppController.getById(id)
        .then(function (userFound) {
            var query = Meetup.findOne({
                confirmed: true
            });

            query.or([{sender_user: id}, {receiver_user: id}]);


            query.exec(function (e, meetupsFound) {
                if (e) {
                    return res.status(400).json({message: 'Cant get the meetups at this moment'});
                }
                return res.json({meetups: meetupsFound});
            });

        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });
};

MeetupController.cancelMeetup = function (req, res) {
    var id = req.params.id;
    var user = req.userapp;
    var receiverId = null;
    MeetupController.getById(id)
        .then(function (meetupFound) {
            if (!meetupFound.confirmed) {
                if (meetupFound.sender_user !== new ObjectId(user)) {
                    return res.status(400).json({message: 'The user needs to be the creator of the meetup'});
                } else {
                    meetupFound.canceled = true;
                    meetupFound.canceled_by = user;
                    meetupFound.last_update = new Date();
                }
            } else {
                if (meetupFound.sender_user === new ObjectId(user) || meetupFound.receiver_user === new ObjectId(user)) {
                    meetupFound.canceled = true;
                    meetupFound.canceled_by = user;
                    meetupFound.last_update = new Date();
                } else {
                    return res.status(400).json({message: 'The user needs to be the creator or the reciever of the meetup'});
                }
            }


            meetupFound.save(function (e, meetupUpdated) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Can cancel the meetup at this moment'});
                }


                // Get the current notification and cancelling it
                NotificationController.getMeetup(meetupUpdated.sender_user, meetupUpdated.receiver_user)
                    .then(function (notificationFound) {

                        notificationFound.active = false;
                        notificationFound.last_update = new Date();

                        notificationFound.save(function (er, notificationUpdated) {
                            if (er) {
                                console.log(er);
                            } else {
                                var o = {};
                                o.reference = 'meetup';
                                o.reference_meetup = meetupUpdated._id;
                                o.sender_user = meetupUpdated.canceled_by;
                                if (meetupUpdated.sender_user === meetupUpdated.canceled_by) {
                                    o.receiver_user = meetupUpdated.receiver_user;
                                } else {
                                    o.receiver_user = meetupUpdated.sender_user;
                                }

                                o.kind = 'cancel';
                                o.date_created = new Date();
                                NotificationController.create(o)
                                    .then(function (notificationCreated) {
                                    })
                                    .fail(function (error) {
                                        console.log(error);
                                    });
                            }

                        });


                    })
                    .fail(function (error) {
                        console.log(error);
                    });


                return res.json({canceled: true, meetup: meetupUpdated});
            });
        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });
};

