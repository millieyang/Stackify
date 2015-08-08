//Users service used for users REST endpoint
angular.module('mean.admin').factory("Schools", ['$resource',
    function ($resource) {
        return $resource('/api/affinitygroups/:schoolId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]).service('AffinityGroupsService', ['$http', function ($http) {
    // this.getAll = function () {
    //     return $http({
    //         method: 'GET',
    //         url: '/api/affinitygroups'
    //     });
    // };
    this.create = function (affinity) {
        return $http({
            method: 'POST',
            url: '/api/affinitygroups',
            data: {
                affinity: affinity
            }
        });
    };
    this.getAffinityGroups = function (id) {
        var test = '/api/affinitygroups/' + id;
        return $http({
            method: 'GET',
            url: test
        });
    };

    this.edit = function (affinity) {
        return $http({
            method: 'POST',
            url: '/api/affinitygroups/edit',
            data: {
                affinitygroup: affinity
            }
        });
    };
}]);