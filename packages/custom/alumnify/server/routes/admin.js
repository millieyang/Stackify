'use strict';
var ProfileController = require('../controllers/profile');
var MajorController = require('../controllers/major');
var CompanyController = require('../controllers/company');
var SchoolController = require('../controllers/frontend/school');
var UserAppController = require('../controllers/frontend/userapp');
var DepartmentController = require('../controllers/department');
var AffinityGroupController = require('../controllers/affinitygroup');
var NotificationController = require('../controllers/frontend/notification');
var ContactController = require('../controllers/contact');


var cors = require('cors');


/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function (Alumnify, app, auth, database) {


    //app.route('/api/schools/:id')
    //    .get(auth.requiresAdmin, SchoolController.getByID);

    app.route('/api/schools')
        .get(auth.requiresLogin, SchoolController.getAll)
        .post(auth.requiresLogin, SchoolController.create);

    app.route('/api/profile/:id').get(auth.requiresLogin, ProfileController.getOrCreate);

    app.route('/api/home/:id').get(auth.requiresLogin, SchoolController.getByID);

    app.route('/api/majors').post(auth.requiresLogin, MajorController.create);
    app.route('/api/majors/:id').get(auth.requiresLogin, SchoolController.getMajors);
    app.route('/api/affinitygroups').post(auth.requiresLogin, AffinityGroupController.create);
    app.route('/api/affinitygroups/:id').get(auth.requiresLogin, SchoolController.getAffinityGroups);
    app.route('/api/departments').post(auth.requiresLogin, DepartmentController.create);
    app.route('/api/departments/:id').get(auth.requiresLogin, SchoolController.getDepartments);
    app.route('/api/companies').post(auth.requiresLogin, CompanyController.createfromAdmin);
    app.route('/api/companies/:id').get(auth.requiresLogin, SchoolController.getCompanies);

    app.route('/api/schools/getByName').get(auth.requiresLogin, SchoolController.getByName);


    app.route('/api/filters/:id').post(auth.requiresLogin, SchoolController.getUsersFilteredfromAdmin);
    app.route('/api/schools/:id/userapps').get(auth.requiresLogin, SchoolController.getAllUsers);

    app.route('/api/userapp/:id').get(auth.requiresLogin, UserAppController.getByIdFromAdmin);

    app.route('/api/connections/:id').get(auth.requiresLogin, UserAppController.getConnectionsfromAdmin);
    app.route('/api/notifications/:id').get(auth.requiresLogin, NotificationController.getByUserforAdmin);
    app.route('/api/majors/edit').post(auth.requiresLogin, MajorController.update);
    app.route('/api/affinitygroups/edit').post(auth.requiresLogin, AffinityGroupController.update);
    app.route('/api/companies/edit').post(auth.requiresLogin, CompanyController.update);
    app.route('/api/departments/edit').post(auth.requiresLogin, DepartmentController.update);


    app.route('/api/companies/:id').put(auth.requiresLogin, CompanyController.update);
    app.route('/api/departments/:id').put(auth.requiresLogin, DepartmentController.update);
    app.route('/api/affinitygroups/:id').put(auth.requiresLogin, AffinityGroupController.update);
    app.route('/api/majors/:id').put(auth.requiresLogin, MajorController.update);

    app.route('api/contact').post(auth.requiresLogin, ContactController.create);

};
