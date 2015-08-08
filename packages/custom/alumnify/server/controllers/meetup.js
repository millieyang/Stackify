'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Meetup = require('../models/meetup');


var MeetupController = {};
module.exports = MeetupController;

var Q = require('q');

var UserAppController = require('./userapp');

MeetupController.getById = function (id) {
    var d = Q.defer();
    var query = Meetup.findOne({
        _id: id
    });

    query.exec(function (e, meetupFound) {
        if (e) {
            console.log(e)
            d.reject({message: 'Cant get the Meetup at this moment'});
        } else {
            if (meetupFound === null) {
                d.reject({message: 'Meetup doesnt exists'});
            } else {
                d.resolve(meetupFound);
            }
        }
    });
    //console.log(d.promise);
    return d.promise;
};

