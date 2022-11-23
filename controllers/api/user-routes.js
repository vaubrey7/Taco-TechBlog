// Variable and require codes
const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const auth = require('../../utils/auth');

// GET all users
router.get('/', (req, res) => {
    User.findAll(
        {
            attributes: {
                exclude: ['password']
            }
        }
    )
    .then(dbUserData => res.json(dbUserData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET a specific user
router.get('/:id', (req, res) => {
    User.findOne(
        {
            attributes: {
                exclues: ['password']
            },
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Post,
                    attributes: [
                        'id',
                        'title',
                        'content',
                        'created_at'
                    ]
                },
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment_text',
                        'created_at'
                    ],
                    include: {
                        model: Post,
                        attributes: ['title']
                    }
                }
            ]
        }
    )
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({
                message: 'No user found with this ID!'
            });
            return;
        }
        res.json(dbUserData);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Create a user
router.post('/', (req, res) => {
    User.create(
        {
            username: req.body.username,
            password: req.body.password
        }
    )
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData);
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Logging in
router.post('/login', (req, res) => {
    User.findOne(
        {
            where: {
                username: req.body.username
            }
        }
    )
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({
                message: 'No user with that username!'
            });
            return;
        }
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(
                {
                    user: dbUserData,
                    message: 'You are now logged in! Enjoy!'
                }
            );
        });

        // Checking password
        const passwordCheck = dbUserData.checkPassword(req.body.password);
        if (!passwordCheck) {
            res.status(400).json({
                message: 'Incorrect password entered, please enter correct password!'
            });
            return;
        }
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(
                {
                    user: dbUserData,
                    message: 'You are now logged in! Enjoy!'
                }
            )
        });
    });
});

// Logging out
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router