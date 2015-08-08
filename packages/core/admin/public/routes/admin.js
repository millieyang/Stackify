'use strict';
angular.module('mean.admin').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('users', {
                url: '/admin/users',
                templateUrl: 'admin/views/users.html',
                resolve: {
                    isValid: function (MeanUser) {
                        return MeanUser.checkRoles(['admin']);
                    }
                }
            })
            .state('themes', {
                url: '/admin/themes',
                templateUrl: 'admin/views/themes.html',
                resolve: {
                    isValid: function (MeanUser) {
                        return MeanUser.checkRoles(['admin']);
                    }
                }
            })
            //.state('settings', {
            //    url: '/admin/settings',
            //    templateUrl: 'admin/views/settings.html',
            //    resolve: {
            //        isAdmin: function (MeanUser) {
            //            return MeanUser.checkAdmin();
            //        }
            //    }
            //}).state('modules', {
            //    url: '/admin/modules',
            //    templateUrl: 'admin/views/modules.html',
            //    resolve: {
            //        isAdmin: function (MeanUser) {
            //            return MeanUser.checkAdmin();
            //        }
            //    }
            //}).state('admin settings', {
            //    url: '/admin/_settings',
            //    templateUrl: 'admin/views/example.html',
            //    resolve: {
            //        isAdmin: function (MeanUser) {
            //            return MeanUser.checkAdmin();
            //        }
            //    }
            //})


            .state('schools', {
                url: '/admin/schools',
                templateUrl: 'admin/views/schools.html',
                resolve: {
                    isValid: function (MeanUser) {
                        return MeanUser.checkRoles(['admin']);
                    }
                }
            })

            .state('majors', {
                url: '/admin/majors',
                templateUrl: 'admin/views/majors.html',
                resolve: {
                    isValid: function (MeanUser) {
                        return MeanUser.checkRoles(['admin', 'school_admin']);
                    }
                }
            })
            //
            //.state('splash', {
            //    url: '/admin/home',
            //    templateUrl: 'admin/views/home.html',
            //    resolve: {
            //        isValid: function (MeanUser) {
            //            return MeanUser.checkRoles(['admin', 'school_admin']);
            //        }
            //    },
            //    controller: 'HomeController'
            //})
            //
            //.state('affinitygroups', {
            //    url: '/admin/affinitygroups',
            //    templateUrl: 'admin/views/affinitygroups.html',
            //    resolve: {
            //        isValid: function (MeanUser) {
            //            return MeanUser.checkRoles(['admin', 'school_admin']);
            //        }
            //    }
            //})
            //
            //.state('departments', {
            //    url: '/admin/departments',
            //    templateUrl: 'admin/views/departments.html',
            //    resolve: {
            //        isValid: function (MeanUser) {
            //            return MeanUser.checkRoles(['admin', 'school_admin']);
            //        }
            //    }
            //})

            //.state('companies', {
            //    url: '/admin/companies',
            //    templateUrl: 'admin/views/companies.html',
            //    resolve: {
            //        isValid: function (MeanUser) {
            //            return MeanUser.checkRoles(['admin', 'school_admin']);
            //        }
            //    }
            //})
            //
            //.state('userapps', {
            //    url: '/admin/userapps',
            //    templateUrl: 'admin/views/userapps.html',
            //    resolve: {
            //        isValid: function (MeanUser) {
            //            return MeanUser.checkRoles(['admin', 'school_admin']);
            //        }
            //    }
            //})

            //.state('profiles', {
            //    url: '/admin/profiles/:userId',
            //    templateUrl: 'admin/views/profiles.html',
            //    resolve: {
            //        isValid: function (MeanUser) {
            //            return MeanUser.checkRoles(['admin', 'school_admin']);
            //        }
            //    }
            //})
            .state('contact', {
                url: '/admin/contact',
                templateUrl: 'admin/views/contact.html',
                resolve: {
                    isValid: function (MeanUser) {
                        return MeanUser.checkRoles(['admin', 'school_admin']);
                    }
                }
            })

        ;
    }
]).config(['ngClipProvider',
    function (ngClipProvider) {
        ngClipProvider.setPath('../admin/assets/lib/zeroclipboard/dist/ZeroClipboard.swf');
    }
]);