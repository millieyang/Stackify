'use strict';

exports.load = function (swagger, parms) {

    var searchParms = parms.searchableOptions;


    var createSchool = {
        'spec': {
            description: 'School operations',
            path: '/schools',
            method: 'POST',
            summary: 'Create School',
            notes: '',
            type: 'School',
            nickname: 'createSchool',
            produces: ['application/json'],
            consumes: ['application/json'],
            responses: {
                'error': {
                    'description': 'Contain information if there is an error, false if no error'
                }
            },
            parameters: [{
                name: 'school',
                description: 'School to create.  User will be inferred by the authenticated user.',
                required: true,
                type: 'School',
                paramType: 'body',
                allowMultiple: false
            }]
        }
    };

    var createMajor = {
        'spec': {
            description: 'Major operations',
            path: '/majors',
            method: 'POST',
            summary: 'Create Major',
            notes: '',
            type: 'Major',
            nickname: 'createMajor',
            produces: ['application/json'],
            consumes: ['application/json'],
            responses: {
                'error': {
                    'description': 'Contain information if there is an error, false if no error'
                }
            },
            parameters: [{
                name: 'major',
                description: 'Major to create.  User will be inferred by the authenticated user.',
                required: true,
                type: 'Major',
                paramType: 'body',
                allowMultiple: false
            }]
        }
    };

    var createAffinityGroup = {
        'spec': {
            description: 'Affinity Group operations',
            path: '/affinities',
            method: 'POST',
            summary: 'Create Affinity Group',
            notes: '',
            type: 'AffinityGroup',
            nickname: 'createAffinityGroup',
            produces: ['application/json'],
            consumes: ['application/json'],
            responses: {
                'error': {
                    'description': 'Contain information if there is an error, false if no error'
                }
            },
            parameters: [{
                name: 'affinity',
                description: 'Affinity Group to create.  User will be inferred by the authenticated user.',
                required: true,
                type: 'AffinityGroup',
                paramType: 'body',
                allowMultiple: false
            }]
        }
    };

    var userCreatesCompany = {
        'spec': {
            description: 'Company operations',
            path: '/frontend/companies',
            method: 'POST',
            summary: 'Company created from a Non Admin User',
            notes: '',
            type: 'Company',
            nickname: 'userCompany',
            produces: ['application/json'],
            consumes: ['application/json'],
            responses: {
                'error': {
                    'description': 'Contain information if there is an error, false if no error'
                }
            },
            parameters: [{
                name: 'company',
                description: 'Company to create.  User will be inferred by the authenticated user.',
                required: true,
                type: 'Company',
                paramType: 'body',
                allowMultiple: false
            }]
        }
    };

    var getCompaniesBySchool = {
        'spec': {
            description: 'Companies operations',
            path: '/frontend/schools/{school}/companies',
            method: 'GET',
            summary: 'Get all Companies',
            notes: '',
            type: 'Company',
            nickname: 'getCompanies',
            produces: ['application/json'],
            params: searchParms,
            parameters: [{
                name: 'school',
                description: 'The SchoolId to filter by',
                in: 'query',
                required: true,
                type: 'Number',
                paramType: 'path',
                allowMultiple: false
            }]


        }
    };

    var getMajorsBySchool = {
        'spec': {
            description: 'Majors operations',
            path: '/frontend/schools/{school}/majors',
            method: 'GET',
            summary: 'Get all Majors',
            notes: '',
            type: 'Major',
            nickname: 'getMajorsBySchool',
            produces: ['application/json'],
            params: searchParms,
            parameters: [{
                name: 'school',
                description: 'The SchoolId to filter by',
                in: 'query',
                required: true,
                type: 'Number',
                paramType: 'path',
                allowMultiple: false
            }]


        }
    };

    var getDepartmentsBySchool = {
        'spec': {
            description: 'Majors operations',
            path: '/frontend/schools/{school}/departments',
            method: 'GET',
            summary: 'Get all Departments',
            notes: '',
            type: 'Department',
            nickname: 'getDepartmentsBySchool',
            produces: ['application/json'],
            params: searchParms,
            parameters: [{
                name: 'school',
                description: 'The SchoolId to filter by',
                in: 'query',
                required: true,
                type: 'Number',
                paramType: 'path',
                allowMultiple: false
            }]

        }
    };

    var getAffinityGroupsBySchool = {
        'spec': {
            description: 'Affinity Group operations',
            path: '/frontend/schools/{school}/affinitygroups',
            method: 'GET',
            summary: 'Get Affinity Groups filter by School',
            notes: '',
            type: 'AffinityGroup',
            nickname: 'getAffinityGroupsBySchool',
            produces: ['application/json'],
            params: searchParms,
            parameters: [{
                name: 'school',
                description: 'The SchoolId to filter by',
                in: 'query',
                required: true,
                type: 'Number',
                paramType: 'path',
                allowMultiple: false
            }]

        }
    };


    var getUsersNearest = {
        'spec': {
            description: 'School operations',
            path: '/frontend/schools/{school}/{user}/nearest',
            method: 'GET',
            summary: 'Get Users that belong to an school, are nearest to the user, and not connected with',
            notes: '',
            type: 'Users',
            nickname: 'getUsersNearest',
            produces: ['application/json'],
            params: searchParms,
            parameters: [{
                name: 'school',
                description: 'The SchoolId to filter by',
                in: 'query',
                required: true,
                type: 'Number',
                paramType: 'path',
                allowMultiple: false
            },
                {
                    name: 'user',
                    description: 'The User ID to filter by',
                    in: 'query',
                    required: true,
                    type: 'Number',
                    paramType: 'path',
                    allowMultiple: false
                }]


        }
    };

    var getUsersFiltered = {
        'spec': {
            description: 'School Operations',
            path: '/frontend/schools/{school}/{user}/others',
            method: 'POST',
            summary: 'Get list of users that are under the same school ID, that satisfy certain parameters',
            notes: '',
            type: 'Users',
            nickname: 'getUsersFiltered',
            produces: ['application/json'],
            consumes: ['application/json'],
            //params: searchParms,
            responses: {
                'error': {
                    'description': 'Contain information if there is an error, false if no error'
                }
            },
            parameters: [
                {
                    name: 'school',
                    description: 'The SchoolId to filter by',
                    in: 'query',
                    required: true,
                    type: 'Number',
                    paramType: 'path',
                    allowMultiple: false
                },
                {
                    name: 'user',
                    description: 'The UserId to filter by',
                    in: 'query',
                    required: true,
                    type: 'Number',
                    paramType: 'path',
                    allowMultiple: false
                },
                {
                    name: 'distance',
                    description: 'Range of distance from the user',
                    required: true,
                    type: 'Number',
                    note: '',
                    paramType: 'form',
                    allowMultiple: false
                },
                {
                    name: 'min_year',
                    description: 'Min year of graduation to filter by',
                    required: true,
                    type: 'Number',
                    note: '',
                    paramType: 'form',
                    allowMultiple: false
                },
                {
                    name: 'max_year',
                    description: 'Max year of graduation to filter by',
                    required: true,
                    type: 'Number',
                    note: '',
                    paramType: 'form',
                    allowMultiple: false
                },
                {
                    name: 'majors',
                    description: 'Array of Majors Id\'s',
                    required: false,
                    type: 'Array',
                    note: 'Empty array [] if no data to filter',
                    paramType: 'form',
                    allowMultiple: true
                },
                {
                    name: 'companies',
                    description: 'Array of Companies Id\'s',
                    required: false,
                    type: 'Array',
                    note: 'Empty array [] if no data to filter',
                    paramType: 'form',
                    allowMultiple: true
                },
                {
                    name: 'affinities',
                    description: 'Array of Affinities Id\'s',
                    required: false,
                    type: 'Array',
                    note: 'Empty array [] if no data to filter',
                    paramType: 'form',
                    allowMultiple: true
                },
                {
                    name: 'deparments',
                    description: 'Array of Departments Id\'s',
                    required: false,
                    type: 'Array',
                    note: 'Empty array [] if no data to filter',
                    paramType: 'form',
                    allowMultiple: true
                }


            ]
        }
    };

    var getPlaces = {
        'spec': {
            description: 'Place operations',
            path: '/frontend/places',
            method: 'GET',
            summary: 'Get list of Places',
            notes: '',
            type: 'Place',
            nickname: 'getPlaces',
            produces: ['application/json'],
            params: searchParms

        }
    };

    var createUserApp = {
        'spec': {
            description: 'UserApp operations',
            path: '/frontend/users/{school}/create',
            method: 'POST',
            summary: 'Creation of a User App',
            notes: '',
            type: 'UserApp',
            nickname: 'createUserApp',
            produces: ['application/json'],
            consumes: ['application/json'],
            responses: {
                'error': {
                    'description': 'Contain information if there is an error, false if no error'
                }
            },
            parameters: [{
                name: 'user',
                description: 'User Object to create.  School will be inferred by the URL.',
                required: true,
                type: 'UserApp',
                paramType: 'body',
                allowMultiple: false
            }]
        }
    };

    var createMessage = {
        'spec': {
            description: 'Message operations',
            path: '/frontend/messages/{from}/{to}',
            method: 'POST',
            summary: 'Creation of a Message',
            notes: '',
            type: 'Message',
            nickname: 'createMessage',
            produces: ['application/json'],
            consumes: ['application/json'],
            responses: {
                'error': {
                    'description': 'Contain information if there is an error, false if no error'
                }
            },
            parameters: [
                {
                    name: 'from',
                    description: 'The UserApp Id from the user that is sending the message',
                    in: 'query',
                    required: true,
                    type: 'Number',
                    paramType: 'path',
                    allowMultiple: false
                },
                {
                    name: 'to',
                    description: 'The UserApp Id from the user that is receiving the message',
                    in: 'query',
                    required: true,
                    type: 'Number',
                    paramType: 'path',
                    allowMultiple: false
                },


                {
                    name: 'message',
                    description: 'Text for the message.  Sender will be inferred by the URL.',
                    required: true,
                    type: 'String',
                    paramType: 'form',
                    allowMultiple: false
                }


            ]
        }
    };


    var getConversation = {
        'spec': {
            description: 'Message operations',
            path: '/frontend/messages/{a}/{b}',
            method: 'GET',
            summary: 'Get conversation of 2 users',
            notes: '',
            type: 'Message',
            nickname: 'getConversation',
            produces: ['application/json'],
            consumes: ['application/json'],
            responses: {
                'error': {
                    'description': 'Contain information if there is an error, false if no error'
                }
            },
            parameters: [
                {
                    name: 'a',
                    description: 'The UserApp Id from the user A',
                    in: 'query',
                    required: true,
                    type: 'Number',
                    paramType: 'path',
                    allowMultiple: false
                },
                {
                    name: 'b',
                    description: 'The UserApp Id from the user B',
                    in: 'query',
                    required: true,
                    type: 'Number',
                    paramType: 'path',
                    allowMultiple: false
                }


            ]
        }
    };


    swagger
        //.addGet(list)
        .addPost(createSchool)
        .addPost(createMajor)
        .addPost(createAffinityGroup)
        .addPost(userCreatesCompany)
        .addGet(getCompaniesBySchool)
        .addGet(getMajorsBySchool)
        .addGet(getDepartmentsBySchool)
        .addGet(getAffinityGroupsBySchool)
        .addGet(getUsersNearest)
        .addPost(getUsersFiltered)
        .addGet(getPlaces)
        .addPost(createUserApp)
        .addPost(createMessage)
        .addGet(getConversation);
};
