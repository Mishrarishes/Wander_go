const express = require('express');
const router = express.Router();
const tourController =require('./../app/http/controllers//tourController')
const authController =require('./../app/http/controllers//authController')
const reviewRouter = require('./reviews');



router.use('/:tourId/reviews',reviewRouter);


router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
.route('/')
.get(tourController.getAllTours)
.post(authController.protect,authController.restrictTo('lead-guide','admin'),tourController.createTour);

/*router.route('/:tourId/reviews').post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
)*/

router
.route('/:id')
.get(tourController.getTour)
.patch(authController.protect,
    authController.restrictTo('admin','lead-guide'),tourController.updateTour)
.delete(authController.protect,
    authController.restrictTo('admin','lead-guide'),
     tourController.deleteTour);



module.exports =router