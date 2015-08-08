'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;
var Admin = new Module('admin');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */

Admin.register(function (app, auth, database) {

    Admin.menus.add({
        title: 'admin settings',
        link: 'admin settings',
        roles: ['admin'],
        menu: 'main'
    });



    Admin.aggregateAsset('css', 'admin.css');
    Admin.aggregateAsset('js', 'async.min.js');
    Admin.aggregateAsset('js', 'classie.js');
    Admin.aggregateAsset('js', 'main.js');
    Admin.aggregateAsset('css', 'styles.css');
    Admin.aggregateAsset('css', 'material.min.css');
    Admin.aggregateAsset('lib/angular', 'angular.js');
    Admin.aggregateAsset('lib/angular', 'angular.min.js');
    Admin.aggregateAsset('lib/angular', 'angular-csp.css');
    Admin.aggregateAsset('lib/angular', 'index.js');
    Admin.aggregateAsset('js', 'modernizr.custom.js');
    Admin.aggregateAsset('js/vendor', 'bootstrap.min.js');
    Admin.aggregateAsset('js/vendor', 'jquery-1.11.3.min.js');
    Admin.aggregateAsset('js/vendor', 'material.min.js');
    Admin.aggregateAsset('js/vendor', 'modernizr-2.8.3.min.js');
    Admin.aggregateAsset('js', '../lib/ng-clip/src/ngClip.js', {
        absolute: false,
        global: true
    });

    Admin.aggregateAsset('js', '../lib/zeroclipboard/dist/ZeroClipboard.js', {
        absolute: false,
        global: true
    });

    Admin.angularDependencies(['ngClipboard']);

    // We enable routing. By default the Package Object is passed to the routes
    Admin.routes(app, auth, database);
    return Admin;
});
