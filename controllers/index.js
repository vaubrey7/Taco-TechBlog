const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');
const dashRoutes = require('./dashboard-routes');

router.use('/api', apiRoutes);
router.use('/dash', dashRoutes);
router.use('/', homeRoutes);

router.use((req, res) => {
    console.log("routes")
    res.status(404).end();
});


module.exports = router;