'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Contact = require('../models/contact');

var ContactController = {};
module.exports = ContactController;


module.exports = ContactController;

ContactController.create = function (req, res) {
    var _contact = req.body.contact;
    var o = {};
    o.message = _contact.message.trim();
    o.via = _contact.via;
    o.school = _contact.school;
    Contact.create(o, function (e, contactCreated) {
        if (e) {
            return res.status(400).json({message: 'Cant create the contact'});
        }
    });
};