//Users service used for users REST endpoint
angular.module('mean.admin').factory("Schools", ['$resource',
    function ($resource) {
        return $resource('/api/majors/:schoolId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]).service('MajorsService', ['$http', function ($http) {
    this.getMajors = function (id) {
        var test = '/api/majors/' + id;
        return $http({
            method: 'GET',
            url: test,
        });
    };
    this.create = function (major) {
        return $http({
            method: 'POST',
            url: '/api/majors',
            data: {
                major: major
            }
        });
    };
    this.edit = function (major) {
        return $http({
            method: 'POST',
            url: '/api/majors/edit',
            data: {
                major: major
            }
        });
    };


}]);