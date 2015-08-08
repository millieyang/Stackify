var MeetupController = require('../controllers/meetup');
//var MeetupController2 = require('../controllers/frontend/meetup');
var id = '55ba679ea35b1dc56b7b42c5'; //meetup id
////var req = [];
//req.body.meetup = {};
//req.body.meetup.sender_user = '55a59a701ef3da465d78a4d9';
//req.body.meetup.receiver_user = '55b165774cfc40d106aebec3';

exports.testSomething = function(test){
    //test.expect(1);
    //test.ok(true, "this assertion should pass");
    test.ok(MeetupController.getById(id),"meetup get works");
    console.log(MeetupController.getById(id));
    test.done();

};

//
//exports.testSomethingElse = function(test){
//    test.ok(MeetupController.create(req),"meetup create works");
//    test.done();


//    test.ok(false, "this assertion should fail");
//    test.done();
//};