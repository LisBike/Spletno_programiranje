var express = require('express');
var router = express.Router();
var locationController = require('../controllers/locationController.js');
var axios = require('axios')
const LocationModel = require("../models/locationModel");

async function fetchData(req, res, next) {
    const response = await axios.get('https://api.jcdecaux.com/vls/v3/stations?apiKey=frifk0jbxfefqqniqez09tw4jvk37wyf823b5j1i&contract=maribor');
    await LocationModel.collection.drop();
    for (const i of response.data) {
        var location = new LocationModel({
            number: i.number,
            name: i.name,
            address: i.address,
            latitude: i.position.latitude,
            longitude: i.position.longitude,
            capacity: i.totalStands.capacity,
            bikes: i.totalStands.availabilities.bikes,
            stands: i.totalStands.availabilities.stands
        });
        await location.save()
    }
    return next()
}

/*
 * GET
 */
router.get('/', fetchData, locationController.list);

/*
 * GET
 */
router.get('/:id', locationController.show);

/*
 * POST
 */
router.post('/', locationController.create);

/*
 * PUT
 */
router.put('/:id', locationController.update);

/*
 * DELETE
 */
router.delete('/:id', locationController.remove);

module.exports = router;
