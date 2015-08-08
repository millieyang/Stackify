'use strict';

angular.module('mean.admin').controller('AffinityGroupController', ['$scope', '$stateParams', 'Global', 'Menus', '$rootScope', '$http', 'AffinityGroupsService', 'MeanUser',
    function ($scope, $stateParams, Global, Menus, $rootScope, $http, AffinityGroupsService, MeanUser) {
        $scope.global = Global;

        $scope.AffinityGroupSchema = [{
            title: 'Affinity Group Name',
            schemaKey: 'affinity_group_name',
            type: 'text',
            inTable: true
        }
        ];

        var schoolid = MeanUser.user.school;
            //$stateParams.schoolId;
        $scope.affinitygroup = {};

        $scope.affinitygroups = [];

        $scope.init = function () {

            AffinityGroupsService.getAffinityGroups(schoolid)
                .success(function (res) {
                    $scope.affinitygroups = res.affinity_groups;
                })
                .error(function (error) {
                    console.log(error.message);
                });

        };

        $scope.add = function () {
            if (!$scope.affinitygroups) $scope.affinitygroups = [];
            $scope.affinitygroup.school = schoolid;

            AffinityGroupsService.create($scope.affinitygroup)
                .success(function (res) {
                    $scope.affinitygroups.push(res.affinitygroup);
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
            if (!$scope.affinitygroups) $scope.affinitygroups = [];
            //console.log($scope.affinitygroups[x]);
            $scope.affinitygroups[x].school = schoolid;

            AffinityGroupsService.edit($scope.affinitygroups[x])
                .success(function (res) {

                    $scope.affinitygroups[x] = res.affinitygroup;
                    //$scope.affinitygroups[x].reload = 'SAVED';
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