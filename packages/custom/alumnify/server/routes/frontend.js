'use strict';
var UserAppController = require('../controllers/frontend/userapp');
var ProfileController = require('../controllers/frontend/profile');
var SchoolController = require('../controllers/frontend/school');
var MajorController = require('../controllers/frontend/major');
var ConversationController = require('../controllers/frontend/conversation');
var MessageController = require('../controllers/frontend/message');
var CompanyController = require('../controllers/frontend/company');
var DepartmentController = require('../controllers/frontend/department');
var NotificationController = require('../controllers/frontend/notification');
var MeetupController = require('../controllers/frontend/meetup');
var PlaceController = require('../controllers/frontend/place');
var AffinityGroupController = require('../controllers/frontend/affinitygroup');
var cors = require('cors');


/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function (Alumnify, app, auth, database) {
    app.use(cors());

    app.route('/api/frontend/profiles/:id').get(ProfileController.getOrCreate);

    app.route('/api/frontend/schools/:id/majors').get(auth.requiresToken, SchoolController.getMajors);
    app.route('/api/frontend/schools/:id/companies').get(auth.requiresToken, SchoolController.getCompanies);
    app.route('/api/frontend/schools/:id/nearest/:page').get(auth.requiresToken, SchoolController.getNearest);
    app.route('/api/frontend/schools/:id/:user/others/:page').post(auth.requiresToken, SchoolController.getUsersFiltered);
    app.route('/api/frontend/schools/:id/departments').get(auth.requiresToken, SchoolController.getDepartments);
    app.route('/api/frontend/schools/:id/affinitygroups').get(auth.requiresToken, SchoolController.getAffinityGroups);
    app.route('/api/frontend/users/majors').put(auth.requiresToken, UserAppController.setMajors);
    app.route('/api/frontend/users/grad_year/:year').put(auth.requiresToken, UserAppController.setGradYear);
    app.route('/api/frontend/profile/affinitygroup/:affinity').post(auth.requiresToken, ProfileController.handleAffinityGroup);
    app.route('/api/frontend/user/companies').post(auth.requiresToken, ProfileController.addCompany);

    app.route('/api/frontend/users/login').post(UserAppController.login);


    app.route('/api/frontend/users/request/:target').post(auth.requiresToken, UserAppController.requestConnection);
    app.route('/api/frontend/users/confirm/:request').post(auth.requiresToken, UserAppController.confirmConnection);

    app.route('/api/frontend/users/delete').delete(auth.requiresToken, UserAppController.setInactive);

    app.route('/api/frontend/users/create').post(UserAppController.create);

    // Why did you add those routes here?
    app.route('/api/frontend/companies').post(auth.requiresToken, CompanyController.create);
    //app.route('/api/frontend/companies/:user').post(CompanyController.create);


    app.route('/api/frontend/user').put(auth.requiresToken, UserAppController.updateInfo);
    app.route('/api/frontend/user/profile').put(auth.requiresToken, ProfileController.updateInfo);

    app.route('/api/frontend/user/companies/:company_department').delete(auth.requiresToken, ProfileController.deleteCompany);

    app.route('/api/frontend/users/connections').get(auth.requiresToken, UserAppController.getConnections);


    app.route('/api/frontend/meetups/create').post(auth.requiresToken, MeetupController.create);
    app.route('/api/frontend/meetups/:id/:receiver/confirm').post(auth.requiresToken, MeetupController.confirm);
    app.route('/api/frontend/meetups/user').get(auth.requiresToken, MeetupController.getMeetupsByUser);
    app.route('/api/frontend/meetups/:id/cancel').get(auth.requiresToken, MeetupController.cancelMeetup);
    app.route('/api/frontend/places').get(PlaceController.getAll);

    app.route('/api/frontend/messages/:from/:to').post(auth.requiresToken, MessageController.create);
    app.route('/api/frontend/conversations').get(auth.requiresToken, ConversationController.get); // List
    app.route('/api/frontend/messages/:a/:b').get(auth.requiresToken, MessageController.getConversation); // Detail
    //app.route('/api/frontend/conversations/:id/:user').get(MessageController.getConversation); // Detail


    app.route('/api/frontend/notifications').get(auth.requiresToken, NotificationController.getByUser);

    app.route('/api/frontend/users/me').get(auth.requiresToken, UserAppController.me);



};
