'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Place = require('../../models/place');

var PlaceController = require('../place');

module.exports = PlaceController;
var Q = require('q');

var UserAppController = require('./userapp');



PlaceController.getAll = function (req, res) {
    var query = Place.find({});

    query.select('_id name address url_logo');
    query.exec(function (e, placesFound) {
        if (e) {
            console.log(e);
            return res.status(400).json({message: 'Cant get places at this moment'});
        }

        return res.json({places: placesFound});
    });
};
