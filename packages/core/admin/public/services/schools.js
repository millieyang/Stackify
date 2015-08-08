//Users service used for users REST endpoint
angular.module('mean.admin').factory("Schools", ['$resource',
    function ($resource) {
        return $resource('/api/schools/:schoolId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]).service('SchoolsService', ['$http', function ($http) {
    this.getAll = function () {
        return $http({
            method: 'GET',
            url: '/api/schools'
        });
    };
    this.create = function (school) {
        return $http({
            method: 'POST',
            url: '/api/schools',
            data: {
                school: school
            }
        });

    }
}]);