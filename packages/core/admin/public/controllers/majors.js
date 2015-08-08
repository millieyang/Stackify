'use strict';

angular.module('mean.admin').controller('MajorController', ['$scope', '$stateParams', 'Global', 'Menus', '$rootScope', '$http', 'MajorsService','MeanUser',
    function ($scope, $stateParams, Global, Menus, $rootScope, $http, MajorsService, MeanUser) {
        $scope.global = Global;
        $scope.majorSchema = [{
            title: 'Major Name',
            schemaKey: 'major_name',
            type: 'text',
            inTable: true

        },
        //{
        //    title: 'School Name',
        //    schemaKey: 'school',
        //    type: 'text',
        //    inTable: false
        //}
        ];
        var schoolid = MeanUser.user.school;
        $scope.major = {};

        $scope.majors = [];

        $scope.init = function () {

            MajorsService.getMajors(schoolid)
                .success(function (res) {
                    $scope.majors = res.majors;
                })
                .error(function (error) {
                    console.log(error.message);
                });


        };

         //   $scope.init = function () {
         //
         //    MajorsService.getAll()
         //        .success(function (res) {
         //            console.log(res);
         //            $scope.majors = res.majors;
         //        })
         //        .error(function (error) {
         //            console.log(error.message);
         //        });
         //
         //
         //};


        // $scope.findbySchool = function() {
        //     Majors.get({
        //         schoolId: $stateParams.schoolId
        //     }, function(majors) {
        //         $scope.majors = majors;
        //     });
        // };

        $scope.add = function () {
            // console.log($stateParams);

            if (!$scope.majors) $scope.majors = [];
            $scope.major.school = schoolid;
            // console.log($scope.major);


            MajorsService.create($scope.major)
                .success(function (res) {

                    $scope.majors.push(res.major);

                })
                .error(function (error) {
                    console.log(error);
                });


        };




        $scope.beforeSelect = function (userField, user) {
            if (userField === 'roles') {
                user.tmpRoles = user.roles;
            }
        };
        $scope.edit = function(x) {
            if (!$scope.majors) $scope.majors = [];
            $scope.majors[x].school = schoolid;

            MajorsService.edit($scope.majors[x])
                .success(function (res) {

                    $scope.majors[x] = res.major;
                    $scope.init();
                    //FIGURE OUT HOW TO RELOAD INIT FUNCTION
                    //$scope.majors.push(res.major);

                })
                .error(function (error) {
                    console.log(error);
                });
        };



        //$scope.remove = function (user) {
        //    for (var i in $scope.users) {
        //        if ($scope.users[i] === user) {
        //            $scope.users.splice(i, 1);
        //        }
        //    }
        //
        //    user.$remove();
        //};
        //
        //$scope.update = function (user, userField) {
        //    if (userField && userField === 'roles' && user.roles.indexOf('admin') === -1) {
        //        if (confirm('Are you sure you want to remove "admin" role?')) {
        //            user.$update();
        //        } else {
        //            user.roles = user.tmpRoles;
        //        }
        //    } else
        //        user.$update();
        //};
        //
        //$scope.beforeSelect = function (userField, user) {
        //    if (userField === 'roles') {
        //        user.tmpRoles = user.roles;
        //    }
        //};

    }
]);