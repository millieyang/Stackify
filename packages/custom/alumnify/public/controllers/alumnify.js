'use strict';

/* jshint -W098 */
angular.module('mean.alumnify').controller('AlumnifyController', ['$scope', 'Global', 'Alumnify',
  function($scope, Global, Alumnify) {
    $scope.global = Global;
    $scope.package = {
      name: 'alumnify'
    };
  }
]);
