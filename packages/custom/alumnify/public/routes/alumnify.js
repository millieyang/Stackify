'use strict';

angular.module('mean.alumnify').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('alumnify example page', {
      url: '/alumnify/example',
      templateUrl: 'alumnify/views/index.html'
    });
  }
]);
