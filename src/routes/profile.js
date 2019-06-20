const express = require( 'express' );
const cache = require( '../controllers/utilities/cache' );

const router = express.Router();
// const { checkAuthentication } = require( '../middlewares' );

router.get( '/allergies', cache.getAllergies );
router.get( '/categories', cache.getCategories );
router.get( '/lifestyles', cache.getLifestyles );
router.get( '/goals', cache.getGoals );

module.exports = router;
