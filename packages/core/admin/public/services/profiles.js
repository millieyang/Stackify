/**
 * Created by Nihar on 7/20/15.
 */
//Users service used for users REST endpoint
angular.module('mean.admin').factory("School", ['$resource',
    function ($resource) {
        return $resource('/api/profiles/:schoolId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]).service('ProfilesService', ['$http', function ($http) {
    this.getProfile = function (id) {
        var route = 'api/profile/' + id;
        return $http({
            method: 'GET',
            url: route
        });
    };
    this.getConnections = function (id) {
        var route = 'api/connections/' + id;
        return $http({
            method: 'GET',
            url: route
        });
    };
    this.getNotifications = function (id) {
        var route = 'api/notifications/' + id;
        return $http({
            method: 'GET',
            url: route
        });
    };
    //this.create = function (userapp) {
    //    //console.log(userapp.school);
    //    var route = 'api/frontend/users/create';
    //    return $http({
    //        method: 'POST',
    //        url: route,
    //        data: {
    //            userapp: userapp
    //        }
    //    });
    //};
}]);