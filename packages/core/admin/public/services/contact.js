/**
 * Created by Nihar on 8/7/15.
 */
//Users service used for users REST endpoint
angular.module('mean.admin').service('ContactService', ['$http', function ($http) {
    this.create = function (contact) {
        var test = '/api/contact';
        return $http({
            method: 'POST',
            url: test,
            data: {
                contact: contact
            }
        });
    };

}]);
