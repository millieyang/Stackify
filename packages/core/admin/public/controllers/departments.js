'use strict';

angular.module('mean.admin').controller('DepartmentController', ['$scope', '$stateParams', 'Global', 'Menus', '$rootScope', '$http', 'DepartmentsService','MeanUser',
    function ($scope, $stateParams, Global, Menus, $rootScope, $http, DepartmentsService, MeanUser) {
        $scope.global = Global;
        $scope.DepartmentSchema = [{
            title: 'Department Name',
            schemaKey: 'department_name',
            type: 'text',
            inTable: true
        }
        ];
        var schoolid = MeanUser.user.school;
        $scope.department = {};

        $scope.departments = [];

        $scope.init = function () {

            DepartmentsService.getDepartments(schoolid)
                .success(function (res) {
                    $scope.departments = res.departments;
                })
                .error(function (error) {
                    console.log(error.message);
                });

        };

        $scope.add = function () {
            if (!$scope.departments) $scope.departments = [];
            $scope.department.school = schoolid;

            DepartmentsService.create($scope.department)
                .success(function (res) {

                    $scope.departments.push(res.department);

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
        $scope.edit = function(x) {
           // console.log('got into edit');
            if (!$scope.departments) $scope.departments = [];
            $scope.departments[x].school = schoolid;

           DepartmentsService.edit($scope.departments[x])
                .success(function (res) {

                    $scope.departments[x] = res.department;
                    $scope.init();
                    //FIGURE OUT HOW TO RELOAD INIT FUNCTION
                    //$scope.majors.push(res.major);

                })
                .error(function (error) {
                    console.log(error);
                });
        };
    }
]);