'use strict';

module.exports = {
  db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/alumnify',
  debug: true,
  logging: {
    format: 'tiny'
  },
  //  aggregate: 'whatever that is not false, because boolean false value turns aggregation off', //false
  aggregate: false,
  mongoose: {
    debug: false
  },
  hostname: 'http://localhost:3000',
  app: {
    name: 'Alumnify'
  },
  strategies: {
      local: {
        enabled: true
      },
      facebook: {
        clientID: '859943564082612',
        clientSecret: '39d10707889663c8c08cd293b07f7965',
        callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
        enabled: false
      },
      twitter: {
        clientID: 'LAQwb1OfJjCVa8zgj7YcvDj82',
        clientSecret: 'lVop0JyMpIsQtQEOWp18qrvRwadkp3fZqUkS81NN5pOg5pCaUC',
        callbackURL: 'http://localhost:3000/api/auth/twitter/callback',
        enabled: false
      },
      github: {
        clientID: 'DEFAULT_APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/api/auth/github/callback',
        enabled: false
      },
      google: {
        clientID: 'DEFAULT_APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/api/auth/google/callback',
        enabled: false
      },
      linkedin: {
        clientID: 'DEFAULT_API_KEY',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:3000/api/auth/linkedin/callback',
        enabled: false
      }
  },
  emailFrom: 'SENDER EMAIL ADDRESS', // sender address like ABC <abc@example.com>
  mailer: {
    service: 'SERVICE_PROVIDER', // Gmail, SMTP
    auth: {
      user: 'EMAIL_ID',
      pass: 'PASSWORD'
    }
  },
  secret: 'SOME_TOKEN_SECRET'
};
