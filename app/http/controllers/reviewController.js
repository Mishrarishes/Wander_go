const express= require('express')

const Review = require('./../../../models/reviewModel');

exports.setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
  };



exports.getAllReviews =async  (req,res) =>{
    try{ 
        let filter ={};
        if(req.params.tourId) filter ={tour:req.params.tourId}
        const reviews = await Review.find(filter);
         
        res.status(200).json({
            status:'success',
            data:{
                reviews
            }
        })
    }
    catch(err){
        res.status(404).json({
            status:'fail',
            message: 'Could not get the reviews'
        })
    }
   
}

exports.createReview =async (req,res) =>{
    try{
        if(!req.body.tour) req.body.tour =req.params.tourId;
        if(!req.body.user) req.body.user = req.user.id;
        const review =await Review.create(req.body);
        review.save();
        res.status(201).json({
            status:'success',
            data:{
                review
            }
        })
    }
    catch(err){
        res.status(404).json({
            status:'fail',
            message: 'could not create the review'
        })
    }
}


exports.updateReview = async (req, res) => {
    const doc = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return new AppError('No document found with that ID', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  };

  
  exports.deleteReview = async (req, res) => {
  const doc = await Review.findByIdAndDelete(req.params.id);

  if (!doc) {
    return new AppError('No document found with that ID', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
};

exports.getReview =async (req, res, next) => {
    let query = Review.findById(req.params.id);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  };