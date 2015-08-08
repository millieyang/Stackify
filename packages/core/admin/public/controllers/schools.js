'use strict';

angular.module('mean.admin').controller('SchoolController', ['$scope', 'Global', 'Menus', '$rootScope', '$http', 'SchoolsService',
    function ($scope, Global, Menus, $rootScope, $http, SchoolsService) {
        $scope.global = Global;
        $scope.schoolSchema = [{
            title: 'School Name',
            schemaKey: 'school_name',
            type: 'text',
            inTable: true
        }, {
            title: 'Color',
            schemaKey: 'school_color',
            type: 'text',
            inTable: true
        }, {
            title: 'Logo',
            schemaKey: 'school_logo',
            type: 'text',
            inTable: true
        },
            {
                title: 'App Name',
                schemaKey: 'school_app_name',
                type: 'text',
                inTable: true
            }, {
                title: 'Location',
                schemaKey: 'school_location',
                type: 'text',
                inTable: true
            }


        ];
        $scope.school = {};

        $scope.schools = [];

        $scope.init = function () {

            SchoolsService.getAll()
                .success(function (res) {
                    $scope.schools = res.schools;
                })
                .error(function (error) {
                    console.log(error.message);
                });

        };

        $scope.add = function () {
            if (!$scope.schools) $scope.schools = [];

            SchoolsService.create($scope.school)
                .success(function (res) {

                    $scope.schools.push(res.school);

                })
                .error(function (error) {
                    console.log(error);
                });


        };

        $scope.remove = function (user) {
            for (var i in $scope.users) {
                if ($scope.users[i] === user) {
                    $scope.users.splice(i, 1);
                }
            }

            user.$remove();
        };

        $scope.update = function (user, userField) {
            if (userField && userField === 'roles' && user.roles.indexOf('admin') === -1) {
                if (confirm('Are you sure you want to remove "admin" role?')) {
                    user.$update();
                } else {
                    user.roles = user.tmpRoles;
                }
            } else
                user.$update();
        };

        $scope.beforeSelect = function (userField, user) {
            if (userField === 'roles') {
                user.tmpRoles = user.roles;
            }
        };

    }
]);