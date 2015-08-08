/**
 * Created by Nihar on 7/22/15.
 */
//Users service used for users REST endpoint
angular.module('mean.system').factory("Home", ['$resource',
    function ($resource) {
        return $resource('/api/home/:schoolId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]).service('HomeService', ['$http', function ($http) {
    this.getHome = function (id) {
        //console.log(id);
        var home = '/api/home/' + id;
        return $http({
            method: 'GET',
            url: home
        });
    };

    this.getHomeName = function (id) {
        var home = '/api/home/' + id;
        return $http({
            method: 'GET',
            url: home
        });
    };
}]);