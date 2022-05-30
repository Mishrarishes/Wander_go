const express = require('express');

const bookingController = require('./../app/http/controllers/bookingController');
const authController = require('./../app/http/controllers/authController')

const router = express.Router();

router.get('/checkout-session/:tourId',authController.protect,bookingController.getCheckoutSession)

module.exports = router