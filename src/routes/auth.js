const express = require( 'express' );

const router = express.Router();
const { checkAuthentication } = require( '../middlewares' );
const AuthController = require( '../controllers/auth' );

router.post( '/token', AuthController.obtainToken );
router.get( '/authorize', AuthController.authorize );
router.post( '/register', AuthController.register );
router.put( '/password', checkAuthentication, AuthController.changePassword );

module.exports = router;
