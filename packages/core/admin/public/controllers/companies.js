'use strict';

angular.module('mean.admin').controller('CompanyController', ['$scope', '$stateParams', 'Global', 'Menus', '$rootScope', '$http', 'CompaniesService','MeanUser',
    function ($scope, $stateParams, Global, Menus, $rootScope, $http, CompaniesService, MeanUser) {
        $scope.global = Global;
        $scope.CompanySchema = [{
            title: 'Company Name',
            schemaKey: 'company_name',
            type: 'text',
            inTable: true
        }
        ];
        var schoolid = MeanUser.user.school;
        $scope.company = {};

        $scope.companies = [];

        $scope.init = function () {

            CompaniesService.getCompanies(schoolid)
                .success(function (res) {
                    $scope.companies = res.companies;
                })
                .error(function (error) {
                    console.log(error.message);
                });

        };

        $scope.add = function () {
            if (!$scope.companies) $scope.companies = [];
            $scope.company.school = schoolid;

            CompaniesService.create($scope.company)
                .success(function (res) {

                    $scope.companies.push(res.company);

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
            //console.log('got into edit');
            if (!$scope.companies) $scope.companies = [];

            $scope.companies[x].school = schoolid;

            CompaniesService.edit($scope.companies[x])
                .success(function (res) {

                    $scope.companies[x] = res.company;
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