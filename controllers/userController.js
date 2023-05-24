const UserModel = require('../models/userModel.js');
const jwt = require('jsonwebtoken');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    showLogin: function (req, res) {
        res.render('users/login')
    },

    showRegister: function (req, res) {
        res.render('users/register');
    },

    showProfile: function (req, res, next) {

        try {
            UserModel.findById(req.user._id).then(async (user) => {
                if (user === null) {
                    let error = new Error("Not Authenticated! Go back!");
                    error.status = 401;
                    return next(401);
                } else {
                    res.render('users/profile', { user: user})
                }
            })
        } catch (err) {
            return next(err)
        }
    },

    login: function (req, res, next) {
        UserModel.authenticate(req.body.username, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error("Authentication failed.");
                err.status = 401;
                return next(err);
            } else {
                req.session.token = jwt.sign(user.toJSON(), 'fF3yRj<mzmE*vHz', {expiresIn: '1h'});

                console.log(req.session.token)

                return res.redirect(200, '/users/profile');
            }
        })
    },

    logout: function (req, res, next) {
        if (req.session.userId) {
            try {
                req.session.destroy()
                return res.redirect('/');
            } catch (err) {
                return next(err);
            }
        }
        return res.redirect('/users/login')
    },

    /**
     * userController.create()
     */
    create: async function (req, res) {
        const {username, password, email} = req.body

        if (password.length < 6) {
            return res.status(400).json({message: "Password less than 6 characters"})
        }

        const user = new UserModel({
            username: username,
            email: email,
            password: password
        });

        try {
            await user.save();
            return res.status(201).json(user);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating user',
                error: err
            });
        }
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
			user.password = req.body.password ? req.body.password : user.password;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
