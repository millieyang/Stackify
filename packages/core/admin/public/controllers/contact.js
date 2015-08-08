/**
 * Created by Nihar on 7/22/15.
 */
'use strict';

angular.module('mean.admin').controller('ContactController', ['$scope', '$stateParams', 'Global', 'Menus', '$rootScope', '$http', 'ContactService','MeanUser',
    function ($scope, $stateParams, Global, Menus, $rootScope, $http, ContactService, MeanUser) {
        $scope.global = Global;

        var schoolid = MeanUser.user.school;

        $scope.message = '';
        $scope.contact = {};
        $scope.success = false;

        $scope.sendForm = function () {

            $scope.contact.message = $scope.message;
            $scope.contact.via = 'adminpanel';
            $scope.contact.school = schoolid;

            ContactService.create($scope.contact)
                .success(function (res) {
                    $scope.success = true;
                })
                .error(function (error) {
                    console.log(error);
                });
        };

    }
]);