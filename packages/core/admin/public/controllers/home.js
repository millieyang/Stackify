'use strict';

angular.module('mean.system').controller('HomeController', ['$scope', '$stateParams', 'Global', 'Menus', '$rootScope', '$http', 'HomeService', 'MeanUser',
    function ($scope, $stateParams, Global, Menus, $rootScope, $http, HomeService, MeanUser) {
        $scope.global = Global;


        //$scope.schoolSchema = [{
        //    title: 'School Name',
        //    schemaKey: 'school_name',
        //    type: 'text',
        //    inTable: true
        //}, {
        //    title: 'Color',
        //    schemaKey: 'school_color',
        //    type: 'text',
        //    inTable: true
        //}, {
        //    title: 'Logo',
        //    schemaKey: 'school_logo',
        //    type: 'text',
        //    inTable: true
        //},
        //    {
        //        title: 'App Name',
        //        schemaKey: 'school_app_name',
        //        type: 'text',
        //        inTable: true
        //    }, {
        //        title: 'Location',
        //        schemaKey: 'school_location',
        //        type: 'text',
        //        inTable: true
        //    }
        //];

        var schoolid = MeanUser.user.school;

        $scope.school = {};

        $scope.init = function () {
            HomeService.getHome(schoolid)
                .success(function (res) {

                    $scope.school = res.school;
                })
                .error(function (error) {
                    console.log(error.message);
                });

        };
    }
]);