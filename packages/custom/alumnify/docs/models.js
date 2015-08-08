exports.models = {

    User: {
        id: 'User',
        required: ['name', 'email', 'username'],
        properties: {
            name: {
                type: 'string',
                description: 'Name of the user'
            },
            email: {
                type: 'string',
                description: 'Email used for authentication and notifications'
            },
            phone: {
                type: 'string',
                description: 'Phone number of the user'
            }

        }
    },
    Users: {
        id: 'Users',
        required: [],
        properties: {
            users: {
                type: 'array',
                description: 'Array of the users'
            }

        }
    },
    UserApp: {
        id: 'UserApp',
        required: ['first_name', 'last_name', 'password', 'email'],
        properties: {
            first_name: {
                type: 'string',
                description: 'First Name of the user'
            },
            last_name: {
                type: 'string',
                description: 'Last Name of the user'
            },
            password: {
                type: 'string',
                description: 'Password of the user'
            },
            email: {
                type: 'string',
                description: 'Email used for authentication and notifications'
            }

        }
    },
    Article: {
        id: 'Article',
        required: ['content'],
        properties: {
            id: {
                type: 'string',
                description: 'Unique identifier for the Article'
            },
            title: {
                type: 'string',
                description: 'Title of the article'
            },
            content: {
                type: 'string',
                description: 'content of the article'
            },
            user: {
                type: 'User',
                description: 'User that created the article'
            }

        }
    },

    School: {
        id: 'School',
        required: ['school_name', 'school_color', 'school_logo', 'school_app_name', 'school_location'],
        properties: {
            school_name: {
                type: 'string',
                description: 'Name of the school'
            },
            school_color: {
                type: 'string',
                description: 'Color of the school'
            },
            school_logo: {
                type: 'string',
                description: 'Logo URL of the School'
            },
            school_app_name: {
                type: 'string',
                description: 'Name for the School s App'
            },
            school_location: {
                type: 'string',
                description: 'Location of the School'
            }
        }
    },

    Major: {
        id: 'Major',
        required: ['major_name', 'school'],
        properties: {
            major_name: {
                type: 'string',
                description: 'Name of the major'
            },
            school: {
                type: 'string',
                description: 'Id of the school'
            }
        }
    },


    AffinityGroup: {
        id: 'AffinityGroup',
        required: ['affinity_group_name', 'school'],
        properties: {
            affinity_group_name: {
                type: 'string',
                description: 'Name of the Affinity Group'
            },
            school: {
                type: 'string',
                description: 'Id of the school'
            }
        }
    },

    Company: {
        id: 'Company',
        required: ['company_name', 'school'],
        properties: {
            company_name: {
                type: 'string',
                description: 'Name of the Company'
            },
            school: {
                type: 'string',
                description: 'Id of the school'
            }
        }
    },
    Department: {
        id: 'Department',
        required: ['deparment_name', 'school'],
        properties: {
            deparment_name: {
                type: 'string',
                description: 'Name of the Department'
            },
            school: {
                type: 'string',
                description: 'Id of the school'
            }
        }
    },
    Place: {
        id: 'Place',
        required: ['name', 'address'],
        properties: {
            name: {
                type: 'string',
                description: 'Name of the Place'
            },
            address: {
                type: 'string',
                description: 'Address of the school'
            },
            url_logo: {
                type: 'string',
                description: 'Url Logo of the place'
            }
        }
    },
    Message: {
        id: 'Message',
        required: ['message'],
        properties: {

            message: {
                type: 'string',
                description: 'Name of the Place'
            }
        }
    }
};
