var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {

    const token = req.session.token;

    if (!token) {
        return res.status(401).json({ error: 'Authorization required' });
    }

    try {
        // Verify and decode the token
        // Attach the decoded token to the request object for further use

        req.user = jwt.verify(token, 'fF3yRj<mzmE*vHz');

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

/*
 * GET
 */
router.get('/', userController.list);
router.get('/login', userController.showLogin);
router.get('/register', userController.showRegister);
router.get('/profile', authenticateToken, userController.showProfile);

/*
 * GET
 */
router.get('/:id', userController.show);

/*
 * POST
 */
router.post('/', userController.create);
router.post('/login', userController.login);

/*
 * PUT
 */
router.put('/:id', userController.update);

/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;
