'use strict';

module.exports = function(sts) {

	var options = {
		skip: function(req, res) {

			 var data = {
                index: 'logs',
                type: 'request',
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode
            };

            sts.index(data);
            return true;
		}
	};

  	sts.app.use(require('morgan')('dev', options));
};