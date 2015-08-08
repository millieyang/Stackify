//Users service used for users REST endpoint
angular.module('mean.admin').factory("Schools", ['$resource',
    function ($resource) {
        return $resource('/api/departments/:schoolId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]).service('DepartmentsService', ['$http', function ($http) {
    this.getDepartments = function (id) {
        var test = '/api/departments/' + id;
        return $http({
            method: 'GET',
            url: test,
        });
    };
    this.create = function (department) {
        return $http({
            method: 'POST',
            url: '/api/departments',
            data: {
                department: department
            }
        });
    };

    this.edit = function (department) {
        return $http({
            method: 'POST',
            url: '/api/departments/edit',
            data: {
                department: department
            }
        });
    };

}]);