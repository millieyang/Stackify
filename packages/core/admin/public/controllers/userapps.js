'use strict';


angular.module('mean.admin').controller('UserAppsController', ['$scope', '$stateParams', 'Global', 'Menus', '$rootScope', '$http', 'UserAppsService', 'ProfilesService', 'MajorsService', 'DepartmentsService', 'AffinityGroupsService', 'CompaniesService', 'MeanUser',
    function ($scope, $stateParams, Global, Menus, $rootScope, $http, UserAppsService, ProfilesService, MajorsService, DepartmentsService, AffinityGroupsService, CompaniesService, MeanUser) {

        $scope.global = Global;



        $scope.userappSchema = [

            {
                title: 'First Name',
                schemaKey: 'first_name',
                type: 'text',
                inTable: false
            }, {
                title: 'Last Name',
                schemaKey: 'last_name',
                type: 'text',
                inTable: false
            }, {
                title: 'Name',
                inTable: true
            }, {
                title: 'Email',
                schemaKey: 'email',
                type: 'text',
                inTable: false
            }, {
                title: 'Grad Year',
                schemaKey: 'grad_year',
                type: 'number',
                inTable: true
            }, {
                title: 'Display Name',
                inTable: false
            }, {
                title: 'About',
                inTable: true
            }, {
                title: 'Company & Department',
                inTable: true
            }, {
                title: 'Majors',
                inTable: true
            }, {
                title: 'Affinity Groups',
                inTable: true
            }, {
                title: 'Date Created',
                inTable: true
            }, {
                title: 'Last Update',
                inTable: true
            }, {
                title: 'Password',
                schemaKey: 'password',
                type: 'password',
                inTable: false
            }];
        var schoolid = MeanUser.user.school;
        $scope.filters = {};
        $scope.majors = [];
        $scope.majorchoices = [];
        $scope.majorchoice = {};
        $scope.departmentchoices = [];
        $scope.departmentchoice = {};
        $scope.departments = [];
        $scope.companychoice = {};
        $scope.companychoices = [];
        $scope.companies = [];
        $scope.affinitygroupchoice = {};
        $scope.affinitygroupchoices = [];
        $scope.affinitygroups = [];
        $scope.userapp = {};
        $scope.userapps = [];

        $scope.init = function () {
            UserAppsService.getUserApps(schoolid)
                .success(function (res) {

                    var x = {};
                    var each = function (userapp, cb) {
                        var userfilled = userapp;
                        ProfilesService.getProfile(userapp._id)
                            .success(function (res) {
                            //$scope.userapps.push(res.profile);
                            userfilled.profile = res.profile;
                            $scope.userapps.push(userfilled);
                            cb(null);
                        }).error(function (error) {
                                console.log(error.message);
                                cb(error);
                            });

                    }
                    var after = function (e) {
                        if (!e) {
                            console.log($scope.userapps);
                        }

                    }
                    async.eachSeries(res.userapps, each, after);
                    //$scope.userapps = res.userapps;

                })
                .error(function (error) {
                    console.log(error.message);
                });
        };

        $scope.add = function () {

            if (!$scope.userapps) $scope.userapps = [];
            $scope.userapp.school = schoolid;

            UserAppsService.create($scope.userapp)
                .success(function (res) {

                    $scope.userapps.push(res.userapp);

                })
                .error(function (error) {
                    console.log(error);
                });


        };

        $scope.getFiltered = function () {
            if (!$scope.userapps) $scope.userapps = [];
            $scope.majorchoices.push($scope.majorchoice._id);
            $scope.affinitygroupchoices.push($scope.affinitygroupchoice._id);
            $scope.departmentchoices.push($scope.departmentchoice._id);
            $scope.companychoices.push($scope.companychoice._id);

            UserAppsService.getFiltered(schoolid, $scope.majorchoices, $scope.affinitygroupchoices, $scope.departmentchoices, $scope.companychoices)
                .success(function (res) {
                    $scope.userapps = res.userapps;
                })
                .error(function (error) {
                    console.log(error);
                });
        };

        $scope.allMajors = function () {

            MajorsService.getMajors(schoolid)
                .success(function (res) {
                    $scope.majors = res.majors;
                })
                .error(function (error) {
                    console.log(error.message);
                });

        };

        $scope.allDepartments = function () {

            DepartmentsService.getDepartments(schoolid)
                .success(function (res) {
                    $scope.departments = res.departments;
                })
                .error(function (error) {
                    console.log(error.message);
                });


        };

        $scope.allAffinityGroups = function () {

            AffinityGroupsService.getAffinityGroups(schoolid)
                .success(function (res) {
                    $scope.affinitygroups = res.affinity_groups;
                })
                .error(function (error) {
                    console.log(error.message);
                });


        };

        $scope.allCompanies = function () {

            CompaniesService.getCompanies(schoolid)
                .success(function (res) {
                    $scope.companies = res.companies;
                })
                .error(function (error) {
                    console.log(error.message);
                });


        };

    }
]);