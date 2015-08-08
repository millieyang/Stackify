//Users service used for users REST endpoint
angular.module('mean.admin').factory("Schools", ['$resource',
    function ($resource) {
        return $resource('/api/userapps/:schoolId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]).service('UserAppsService', ['$http', function ($http) {
    this.getUserApps = function (id) {
        var route = '/api/schools/' + id + '/userapps';
        return $http({
            method: 'GET',
            url: route
        });
    };
    this.create = function (userapp) {
        var route = '/api/frontend/users/create';
        return $http({
            method: 'POST',
            url: route,
            data: {
                userapp: userapp
            }
        });

    };
    this.getUserApp = function(id) {
        var route = '/api/userapp/' + id;
        return $http({
            method: 'GET',
            url: route
        });
    };

    this.getFiltered = function (id, majors, departments, affinitygroups, companies) {
        var test = '/api/filters/'+ id;
        return $http({
            method: 'POST',
            url: test,
            data: {
                majors: majors,
                departments: departments,
                affinitygroups: affinitygroups,
                companies: companies
            }
        });
    };
}]);