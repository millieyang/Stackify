'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    AffinityGroup = require('../models/affinitygroup');

//var UserController = require('../../../../../core/users/server/controllers/users')(null);

var AffinityGroupController = {};
module.exports = AffinityGroupController;

var SchoolController = require('./school');
var Q = require('q');

AffinityGroupController.create = function (req, res) {
    var _affinity = req.body.affinity;
    var o = {};
    SchoolController.getById(_affinity.school)
        .then(function (schoolFound) {

            o.affinity_group_name = _affinity.affinity_group_name.trim();
            o.normalized_name = o.affinity_group_name;
            o.school = schoolFound._id;
            o.date_created = new Date();

            AffinityGroup.create(o, function (e, affinityCreated) {
                if (e) {
                    return res.status(400).json({message: 'Cant create the Affinity Group'});
                }

                schoolFound.affinity_groups.push(affinityCreated._id);
                schoolFound.last_update = new Date();
                schoolFound.save(function (er, schoolUpdated) {
                    if (er) {
                        console.log(er);
                        return res.status(400).json({message: 'Affinity Group created but couldnt add to the School'});
                    }
                    return res.json({affinitygroup: affinityCreated});
                });
            });
        })
        .fail(function (error) {
            console.log(error);
            return res.status(400).json(error);
        });
};


AffinityGroupController.getById = function (id) {
    var d = Q.defer();

    var query = AffinityGroup.findOne({
        _id: id
    });

    query.exec(function (e, affinityFound) {
        if (e) {
            console.log(e);
            d.reject({message: 'Cant query affinity'});
        } else {

            if (affinityFound === null) {
                d.reject({message: 'Affinity Group doenst exists'});
            } else {
                d.resolve(affinityFound);
            }
        }
    });

    return d.promise;
};


AffinityGroupController.update = function (req, res) {
   // var id = req.params.id;
    var _affinitygroup = req.body.affinitygroup;
    AffinityGroupController.getById(_affinitygroup._id)
        .then(function (affinityFound) {


            affinityFound.affinity_group_name = _affinitygroup.affinity_group_name.trim();
            affinityFound.normalized_name = affinityFound.affinity_group_name;


            affinityFound.last_update = new Date();
            affinityFound.save(function (e, affinityUpdated) {
                if (e) {
                    console.log(e);
                    return res.status(400).json({message: 'Cant update the affinity'});
                }
                return res.json({affinitygroup: affinityUpdated});
            });


        })
        .fail(function (error) {
            console.log(error);

            return res.status(400).json(error);

        });

};