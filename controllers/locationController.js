var LocationModel = require('../models/locationModel.js');

/**
 * locationController.js
 *
 * @description :: Server-side logic for managing locations.
 */
module.exports = {

    /**
     * locationController.list()
     */
    list: async function (req, res) {
        try {
            const locations = await LocationModel.find({});
            return res.json(locations)
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting location.',
                error: err
            });
        }
    },

    /**
     * locationController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        LocationModel.findOne({_id: id}, function (err, location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting location.',
                    error: err
                });
            }

            if (!location) {
                return res.status(404).json({
                    message: 'No such location'
                });
            }

            return res.json(location);
        });
    },

    /**
     * locationController.create()
     */
    create: function (req, res) {
        var location = new LocationModel({
            number: req.body.number,
            name: req.body.name,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            capacity: req.body.capacity,
            bikes: req.body.bikes,
            stands: req.body.stands
        });

        location.save(function (err, location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating location',
                    error: err
                });
            }

            return res.status(201).json(location);
        });
    },

    /**
     * locationController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        LocationModel.findOne({_id: id}, function (err, location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting location',
                    error: err
                });
            }

            if (!location) {
                return res.status(404).json({
                    message: 'No such location'
                });
            }

            location.number = req.body.number ? req.body.number : location.number;
            location.name = req.body.name ? req.body.name : location.name;
            location.address = req.body.address ? req.body.address : location.address;
            location.latitude = req.body.latitude ? req.body.latitude : location.latitude;
            location.longitude = req.body.longitude ? req.body.longitude : location.longitude;
            location.capacity = req.body.capacity ? req.body.capacity : location.capacity;
            location.bikes = req.body.bikes ? req.body.bikes : location.bikes;
            location.stands = req.body.stands ? req.body.stands : location.stands;

            location.save(function (err, location) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating location.',
                        error: err
                    });
                }

                return res.json(location);
            });
        });
    },

    /**
     * locationController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        LocationModel.findByIdAndRemove(id, function (err, location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the location.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
