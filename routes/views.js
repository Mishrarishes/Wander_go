const express = require('express')
const router = express.Router();
const viewController = require('./../app/http/controllers/viewController')
const authController = require('./../app/http/controllers/authController')
 

router.get('/',authController.isLoggedIn,viewController.getOverview);
router.get('/tour/:slug',authController.protect,viewController.getTour);
router.get('/me',authController.protect,viewController.getAccount);
router.get('/login',viewController.getLoginForm);


router.post(
    '/submit-user-data',
    authController.protect,
    viewController.updateUserData
  );

module.exports = router