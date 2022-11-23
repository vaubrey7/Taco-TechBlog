const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const auth = require('../utils/auth');

// Get all posts
router.get('/', (req, res) => {
    Post.findAll(
        {
            attributes: [
                'id',
                'title',
                'content',
                'created_at',
            ],
            include: [
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment_text',
                        'post_id',
                        'user_id',
                        'created_at',
                    ],
                    include: {
                        model: User,
                        attributes: ['username']
                    }                        
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        }
    )
    .then(dbPostDatea => {
        const posts = dbPostDatea.map(post => post.get(
            {
                plain: true
            }
        ));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET one post
router.get('/post/:id', (req, res) => {
    Post.findOne(
        {
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'content',
                'created_at',
            ],
            include: [
                {
                    model: Comment,
                    attributes: [
                        'id',
                        'comment_text',
                        'post_id',
                        'user_id',
                        'created_at',
                    ],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        }
    )
    .then(dbPostDatea => {
        if (!dbPostDatea) {
            res.status(404).json(
                {
                    message: 'No post found with this ID!'
                }
            );
            return;
        }
        const post = dbPostDatea.get(
            {
                plain: true
            }
        );
        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Logging in
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

// Signing up for the blog
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

// Error page
router.get('*', (req, res) => {
    res.status(404).send('The page you are trying to view is no longer in service');
})

module.exports = router;