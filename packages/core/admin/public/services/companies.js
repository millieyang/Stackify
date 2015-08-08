//Users service used for users REST endpoint
angular.module('mean.admin').factory("Schools", ['$resource',
    function ($resource) {
        return $resource('/api/companies/:schoolId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]).service('CompaniesService', ['$http', function ($http) {
    this.getCompanies = function (id) {
        var test = '/api/companies/' + id;
        return $http({
            method: 'GET',
            url: test,
        });
    };
    this.create = function (company) {
        return $http({
            method: 'POST',
            url: '/api/companies',
            data: {
                company: company
            }
        });
    };

    this.edit = function (company) {
        return $http({
            method: 'POST',
            url: '/api/companies/edit',
            data: {
                company: company
            }
        });
    };

}]);
