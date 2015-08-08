/**
 * Created by Nihar on 7/20/15.
 */
'use strict';

angular.module('mean.admin').controller('ProfilesController', ['$scope', '$stateParams', 'Global', 'Menus', '$rootScope', '$http', 'ProfilesService', 'UserAppsService','MeanUser',
    function($scope, $stateParams, Global, Menus, $rootScope, $http, ProfilesService, UserAppsService, MeanUser) {
        $scope.global = Global;
        $scope.profileSchema = [
            {
                title: 'Profile Pic',
                schemaKey: 'profile_pic',
                type: 'text',
                inTable: true
            }, {
                title: 'Display Name',
                schemaKey: 'display_name',
                type: 'text',
                inTable: true
            }, {
                title: 'About',
                schemaKey: 'about',
                type: 'text',
                inTable: true
            }, {
                title: 'Company & Department',
                schemaKey: 'company_department',
                type: 'text',
                inTable: true
            }, {
                title: 'Majors',
                schemaKey: 'majors',
                type: 'text',
                inTable: true
            }, {
                title: 'Affinity Groups',
                schemaKey: 'affinity_groups',
                type: 'text',
                inTable: true
            }, {
                title: 'Date Created',
                schemaKey: 'date_created',
                type: 'text',
                inTable: true
            }, {
                title: 'Last Update',
                schemaKey: 'last_update',
                type: 'text',
                inTable: true
            }];

        var schoolid = MeanUser.user.school;
        $scope.profile = {};
        $scope.userapp = {};
        $scope.connections = [];
        $scope.notifications = [];

        $scope.init = function () {
            ProfilesService.getProfile($stateParams.userId)
                .success(function (res) {
                    $scope.profile = res.profile;
                })
                .error(function (error) {
                    console.log(error.message);
                });
            ProfilesService.getConnections($stateParams.userId)
                .success(function (res) {
                    $scope.connections = res.connections;
                })
            .error(function (error) {
                console.log(error.message);
                });
            ProfilesService.getNotifications($stateParams.userId)
                .success(function (res) {
                    $scope.notifications = res.notifications;
                    for (var i = 0; i < $scope.notifications.length; i++) {
                        $scope.notifications[i].text = "";
                        if ($scope.notifications[i].reference == "connect") {
                            if ($scope.notifications[i].kind == "invite") {
                                $scope.notifications[i].text = $scope.notifications[i].sender_user.first_name + " " + $scope.notifications[i].sender_user.last_name + " wants to connect with " + $scope.notifications[i].receiver_user.first_name + " " + $scope.notifications[i].receiver_user.last_name;
                            }
                            else if ($scope.notifications[i].kind == "accept") {
                                $scope.notifications[i].text = $scope.notifications[i].sender_user.first_name + " " + $scope.notifications[i].sender_user.last_name + " is connected with " + $scope.notifications[i].receiver_user.first_name + " " + $scope.notifications[i].receiver_user.last_name;
                            }
                            else {
                                $scope.notifications[i].text = "error";
                            }
                        }

                        if ($scope.notifications[i].reference == "meetup") {
                            if ($scope.notifications[i].kind == "invite") {
                                $scope.notifications[i].text = $scope.notifications[i].sender_user.first_name + " " + $scope.notifications[i].sender_user.last_name + " wants to schedule a meetup with " + $scope.notifications[i].receiver_user.first_name + " " + $scope.notifications[i].receiver_user.last_name;
                            }
                            else if ($scope.notifications[i].kind == "accept") {
                                $scope.notifications[i].text = $scope.notifications[i].sender_user.first_name + " " + $scope.notifications[i].sender_user.last_name + " is meeting up with " + $scope.notifications[i].receiver_user.first_name + " " + $scope.notifications[i].receiver_user.last_name;
                            }
                            else {
                                $scope.notifications[i].text = "error";
                            }
                        }

                    }

                })
                .error(function (error) {
                    console.log(error.message);
                });
            UserAppsService.getUserApp($stateParams.userId)
                .success(function (res) {
                    $scope.userapp = res.userapp;
                })
                .error(function (error) {
                    console.log(error.message);
                });



            //console.log($scope);
        };

        //$scope.get = function () {
        //    ProfilesService.getProfile($stateParams.userId)
        //        .success(function (res) {
        //            console.log(res);
        //            $scope.profile = res.profile;
        //        })
        //        .error(function (error) {
        //            console.log(error.message);
        //        });
        //};


    }
]);