var express = require('express');
var router = express.Router();
const LocationModel = require("../models/locationModel");
const opencage = require('opencage-api-client');
const jwt = require("jsonwebtoken");

function calculateDistance(pointA, pointB) {
    const earthRadius = 6371; // km

    const latDiff = (pointB.latitude - pointA.latitude) * Math.PI / 180;
    const lngDiff = (pointB.longitude - pointA.longitude) * Math.PI / 180;

    const a =
        Math.sin(latDiff / 2) ** 2 +
        Math.cos(pointA.latitude * Math.PI / 180) *
        Math.cos(pointB.latitude * Math.PI / 180) *
        Math.sin(lngDiff / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
}

function authenticateToken(req, res, next) {

    const token = req.session.token;

    if (!token) {
        return res.status(401).json({error: 'Authorization required'});
    }

    try {
        // Verify and decode the token
        // Attach the decoded token to the request object for further use

        req.user = jwt.verify(token, 'fF3yRj<mzmE*vHz');

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({error: 'Invalid token'});
    }
}


/* GET home page. */
router.get('/', authenticateToken, async function (req, res, next) {

    let point = {latitude: 46.5621393, longitude: 15.6531517};
    let closestPoint = null;
    let closestDistance = null;

    try {
        const locations = await LocationModel.find({});
        if (req.query.location) {
            try {
                const response = await opencage.geocode({
                    q: req.query.location,
                    key: '242ad2312c3449cab4f46cd26bf46bf5'
                });
                const {lat, lng} = response.results[0].geometry;
                point = {latitude: lat, longitude: lng};
            } catch (error) {
                console.error(error);
                return res.status(500).json({error: 'Geocoding error'});
            }

            for (const i of locations) {
                const distance = calculateDistance(i, point);
                if (closestDistance === null || distance < closestDistance) {
                    closestDistance = distance;
                    closestPoint = i;
                }
            }
        }

        return res.render('index', {
            title: 'Express',
            locations: locations,
            closest: closestPoint,
            query: req.query.location
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Error when getting location.',
            error: err
        });
    }
});

router.get('/map', async function (req, res, next) {

    const locations = await LocationModel.find({});

    return res.render('map', {
        locations: locations,
        apiKey: process.env.GOOGLE_MAPS_API_KEY
    })
});

module.exports = router;
