'use strict';

angular.module('mean.admin').controller('AdminController', ['$scope', '$stateParams', 'Global', 'Menus', '$rootScope', '$http', 'MeanUser',
    function ($scope, $stateParams, Global, Menus, $rootScope, $http, MeanUser) {

        $scope.global = Global;
        $scope.menus = {};
        $scope.overIcon = false;
        $scope.user = MeanUser;
        var icons = 'admin/assets/img/icons/';

        var defaultAdminMenu = [];

        // Query menus added by modules. Only returns menus that user is allowed to see.
        function queryMenu(name, defaultMenu) {

            Menus.query({
                name: name,
                defaultMenu: defaultMenu
            }, function (menu) {
                $scope.menus[name] = menu;
            });
        }

        // Query server for menus and check permissions
        queryMenu('admin', defaultAdminMenu);

        $scope.isCollapsed = false;

        $rootScope.$on('loggedin', function () {

            if(MeanUser.user.roles.indexOf('admin')>-1) {
                defaultAdminMenu = [
                    {
                        'roles': ['admin'],
                        'title': 'ADMINUSERS',
                        'link': 'users',
                        'icon': icons + 'home.png'
                    }, {
                        'roles': ['admin', 'school_admin'],
                        'title': 'HOME',
                        'link': 'splash',
                        'icon': icons + 'home.png'
                    },
                    {
                        'roles': ['admin'],
                        'title': 'SCHOOLS',
                        'link': 'schools',
                        'icon': icons + 'majors.png'
                    },
                    {
                        'roles': ['admin', 'school_admin'],
                        'title': 'USERS',
                        'link': 'userapps',
                        'icon': icons + 'affinitygroups.png'
                    },

                    {
                        'roles': ['admin', 'school_admin'],
                        'title': 'MAJORS',
                        'link': 'majors',
                        'icon': icons + 'majors.png'
                    },
                    {
                        'roles': ['admin', 'school_admin'],
                        'title': 'AFFINITYGROUPS',
                        'link': 'affinitygroups',
                        'icon': icons + 'group.png'
                    },
                    {
                        'roles': ['admin', 'school_admin' ],
                        'title': 'DEPARTMENTS',
                        'link': 'departments',
                        'icon': icons + 'departments.png'
                    },
                    {
                        'roles': ['admin', 'school_admin'],
                        'title': 'COMPANIES',
                        'link': 'companies',
                        'icon': icons + 'companies.png'
                    },
                    {
                        'roles': ['admin', 'school_admin'],
                        'title': 'CONTACT',
                        'link': 'contact',
                        'icon': icons + 'contact.png'
                    }
                    //{
                    //    'roles': ['admin', 'school_admin'],
                    //    'title': 'PROFILES',
                    //    'link': 'profiles',
                    //    'icon': icons + 'contact.png'
                    //}


                ];
            }
            else {
                defaultAdminMenu = [

                    {
                        'roles': ['admin', 'school_admin'],
                        'title': 'HOME',
                        'link': 'splash',
                        'icon': icons + 'home.png'
                    },
                    {
                        'roles': ['admin', 'school_admin'],
                        'title': 'USERS',
                        'link': 'userapps',
                        'icon': icons + 'affinitygroups.png'
                    },
                    {
                        'roles': ['admin', 'school_admin'],
                        'title': 'MAJORS',
                        'link': 'majors',
                        'icon': icons + 'majors.png'
                    },
                    {
                        'roles': ['admin', 'school_admin'],
                        'title': 'AFFINITYGROUPS',
                        'link': 'affinitygroups',
                        'icon': icons + 'group.png'
                    },
                    {
                        'roles': ['admin', 'school_admin' ],
                        'title': 'DEPARTMENTS',
                        'link': 'departments',
                        'icon': icons + 'departments.png'
                    },
                    {
                        'roles': ['admin', 'school_admin'],
                        'title': 'COMPANIES',
                        'link': 'companies',
                        'icon': icons + 'companies.png'
                    },
                    {
                        'roles': ['admin', 'school_admin'],
                        'title': 'CONTACT',
                        'link': 'contact',
                        'icon': icons + 'contact.png'
                    }
                    //{
                    //    'roles': ['admin', 'school_admin'],
                    //    'title': 'PROFILES',
                    //    'link': 'profiles',
                    //    'icon': icons + 'contact.png'
                    //}


                ];
            }



            queryMenu('admin', defaultAdminMenu);

            $scope.global = {
                authenticated: !!$rootScope.user,
                user: $rootScope.user
            };
        });
    }
]);
