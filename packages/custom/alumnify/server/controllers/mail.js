/**
 * Created by Nihar on 7/22/15.
 */
'use strict';

/**
 * Module dependencies.
 */

var Q = require('q');
var nodemailer = require('nodemailer');

var MailController = {};

MailController.sendContactMail = function (req, res) {

// create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'myang@alumnify.co',
            pass: 'Hello'
        }
    });

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'Millie Yang <myang@alumnify.co>', // sender address
        to: 'jpachter@alumnify.co', // list of receivers
        subject: 'Test', // Subject line
        text: 'Test', // plaintext body
        html: '<b>Hello world ✔</b>' // html body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

    });
};

module.exports = MailController;