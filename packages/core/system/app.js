'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module,
    favicon = require('serve-favicon');

var SystemPackage = new Module('system');

var TokenController = require('../../custom/alumnify/server/controllers/token');
/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
SystemPackage.register(function (app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    SystemPackage.routes(app, auth, database);
    SystemPackage.aggregateAsset('css', 'common.css');
    SystemPackage.aggregateAsset('css','animate.min.css');
    SystemPackage.aggregateAsset('css','bootstrap.min.css');
    SystemPackage.aggregateAsset('css','common.css');
    SystemPackage.aggregateAsset('css','creative.css');
    SystemPackage.aggregateAsset('css','material.min.css');
    SystemPackage.aggregateAsset('js','bootstrap.min.js');
    SystemPackage.aggregateAsset('js','jquery.js');
    SystemPackage.aggregateAsset('js','creative.js');
    SystemPackage.aggregateAsset('img','bg.jpg');
    SystemPackage.angularDependencies(['ui.router', 'mean-factory-interceptor']);

    // The middleware in config/express will run before this code

    // Set views path, template engine and default layout
    app.set('views', __dirname + '/server/views');

    // Setting the favicon and static folder
    app.use(favicon(__dirname + '/public/assets/img/favicon.ico'));


    // Adding robots and humans txt
    app.useStatic(__dirname + '/public/assets/static');

    app.use(function (req, res, next) {

        var auth = req.headers['authenticated'];

        req.userapp = null;

        if (typeof(auth) !== 'undefined') {

            var tmp = auth.split(' ');
            if (tmp[0] === 'Token') {
                TokenController.getById(tmp[1])
                    .then(function (tokenFound) {
                        req.userapp = tokenFound.user.toString();
                        next();
                    })
                    .fail(function (error) {
                        console.log(error);
                        // Error
                        res.status(401).json(error);
                    });

            } else {
                //ERROR
                next();
            }

        } else {
            next();
        }


    });


    SystemPackage.menus.add({
        title: 'Log Out',
        link: 'Log Out',
        roles: ['authenticated'],
        menu: 'account'
    });


    return SystemPackage;

});
