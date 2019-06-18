const express = require( 'express' );
const cache = require( '../controllers/utilities/cache' );

const router = express.Router();
// const { checkAuthentication } = require( '../middlewares' );

router.get( '/allergy', cache.getAllergies );
router.get( '/category', cache.getCategories );
router.get( '/lifestyle', cache.getLifestyles );
router.get( '/goal', cache.getGoals );

module.exports = router;
