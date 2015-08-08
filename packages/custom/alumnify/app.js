'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Alumnify = new Module('alumnify');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Alumnify.register(function(app, auth, database, swagger) {

  //We enable routing. By default the Package Object is passed to the routes
  Alumnify.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  /*
  Alumnify.menus.add({
    title: 'alumnify example page',
    link: 'alumnify example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  */



  Alumnify.aggregateAsset('css', 'alumnify.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Alumnify.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Alumnify.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Alumnify.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  swagger.add(__dirname);

  return Alumnify;
});
