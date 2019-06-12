const express = require( 'express' );

const router = express.Router();
const { checkAuthentication } = require( '../middlewares' );
const AuthController = require( '../controllers/auth' );

router.get( '/me', checkAuthentication, AuthController.me );
router.post( '/token', AuthController.obtainToken );
router.get( '/authorize', AuthController.authorize );
router.post( '/register', AuthController.register );

module.exports = router;
