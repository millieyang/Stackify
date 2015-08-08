'use strict';



module.exports = function(StackSight, sts) {

	var EventEmitter = require('events').EventEmitter,
		stsEvents = new EventEmitter();


	function Events() {}


	Events.prototype.publish = function(key, name , data) {

	    stsEvents.emit(key + ' ' + name, data);

        var design = data.design || {};
        design.color = data.design.color || '#176583';
        design.icon = data.design.icon || 'fa-bars';
        delete data.design;

		var options = {
			index: 'events',
			type: 'events',
			key: key,
            name: name,
            design: design,
			data: data
		};

		sts.index(options);
	   
	};

	Events.prototype.subscribe = function(name, cb) {
	    stsEvents.on(name, cb);
	};

	StackSight.prototype.events = new Events();

};

