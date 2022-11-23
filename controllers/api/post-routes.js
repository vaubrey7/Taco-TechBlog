// Variables and require codes
const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const auth = require('../../utils/auth');

// GET all posts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id', 
            'content', 
            'title', 
            'created_at'
        ],
        order: [
            ['created_at', 'DESC']
        ],
        include: [
            {
                model: User,
                attributes: ['username'],
            },
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
                    attriutes: ['username'],
                },
            }
        ],
    })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET a single post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: [
            'id',
            'content',
            'title',
            'created_at',
        ],
        include: [
            {
                model: User,
                attributes: ['username'],
            },
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
                    attributes: ['username'],
                },
            },
        ],
    })
    .then((dbPostData) => {
        if (!dbPostData) {
            res.status(404).json({
                message: 'No post found with this ID'
            });
            return;
        }
        res.json(dbPostData);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Create a post
router.post('/', auth, (req, res) => {
    console.log('creating post...');
    Post.create(
        {
            title: req.body.title,
            content: req.body.post_content,
            user_id: req.session.user_id
        }
    )
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Update an existing post
router.put('/:id', auth, (req, res) => {
    Post.update(
        {
            title: req.body.title,
            content: req.body.post_content,
        },
        {
            where: {
                id: req.params.id,
            },
        }
    )
    .then((dbPostData) => {
        if (!dbPostData) {
            res.status(404).json({
                message: 'No post found with this ID'
            });
            return;
        }
        res.json(dbPostData);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Delete an existing post
router.delete('/:id', auth, (req, res) => {
    Post.destroy(
        {
            where: {
                id: req.params.id,
            },
        }
    )
    .then((dbPostData) => {
        if (!dbPostData) {
            res.status(404).json({
                message: 'No post found with this ID'
            });
            return;
        }
        res.json(dbPostData);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;