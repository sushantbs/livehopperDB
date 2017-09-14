let express = require('express');
let router = express.Router();
let personRouteHandler = require('./person');
let gigRouteHandler = require('./gig');

router.use('/api/user', personRouteHandler);
router.use('/api/gig', gigRouteHandler);
// router.use('/api/artist', artistRouteHandler);
// router.use('/api/host', hostRouteHandler);

/**
 * Rendering route
 */

router.get('/', (req, res, next) => {
	res.render('index', {
		title: 'GrassHopper Data Viewer'
	});
});

module.exports = router;
