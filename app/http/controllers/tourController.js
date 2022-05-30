const fs =require('fs')
const Tour = require('./../../../models/tourmodel')


exports.getAllTours = async (req,res) =>{
   try{
       //Build a query
    const queryObj = {...req.query};
    const excludedFields = ['page','sort','limit','fields']
    excludedFields.forEach(el => delete queryObj[el] );
    

    //console.log(req.query,queryObj);
    let query =  Tour.find(queryObj) 

    //2 Sorting
    if(req.query.sort){
        query  =query.sort(req.query.sort)
    }else
    {
        query = query.sort('-createdAt');
    }

    const tours = await query;

    res.status(200).json({
        status :'success',
        data : {
            tours 
        }
    });
}
  catch (err) {
   res.status(404).json({
       status:'fail',
       message :err
   })
  }
    
}

exports.getTour = async (req,res)=>{
   
   try{
    const tour =  await Tour.findById(req.params.id).populate('guides');
    // Tour.findOne({_id: req.params.id })
    res.status(200).json({
        status : "success", 
        data : {
            tour
        }
    })
   }
   catch (err) {
    res.status(404).json({
        status:'fail',
        message :err
    })
   }

  }

  exports.createTour = async (req,res)=>{
  try{
   const newTour =  await Tour.create(req.body);

    res.status(201).json({
        status : 'success',
        data:{
            tour: newTour
        }
    })
  } catch(err){
      res.status(400).json({
          status :'fail',
          message :err
      })
  }
   
}

exports.updateTour = async (req,res)=>{
  
try{
  const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators :true
  })
    res.status(200).json({
        status :'success',
        data:{
            tour 
        }
    })
}
catch(err){
    res.status(400).json({
        status :'fail',
        message :err
    })
}

}

exports.deleteTour = async (req,res)=>{
try{
    const tour =await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
        status :'success',
        data:'null'
    })
}
catch(err){
    res.status(400).json({
        status :'fail',
        message :err
    })
}

}

exports.getToursWithin = async (req,res,next) =>{
    const { distance,latlng ,unit} =req.params;
    const [lat,lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance /3963.2 : distance/6378.1;

    if(!lat || !lng) {
        return res.status(400).json({
            status:'fail',
            messgae:'Please provide latitude and longitude in format lat,lng'
        })
    }
   try{
         const tours = await Tour.find({
             startLocation: {
                 $geoWithin :{
                     $centerSphere :[
                         [lng,lat], radius
                     ]
                 }
             }
         });

            res.status(200).json({
            status:'success',
            results:tours.length,
            data:{
                data:tours
            }
            })
      }
   catch(err){
    return res.status(400).json({
        status:'fail',
        messgae:err
               })
       }
}

exports.getDistances = async(req,res,next) =>{
    const { latlng ,unit} =req.params;
    const [lat,lng] = latlng.split(',');


    if(!lat || !lng) {
        return res.status(400).json({
            status:'fail',
            messgae:'Please provide latitude and longitude in format lat,lng'
        })
    }

  const distances = await Tour.aggregate([
      {
          $geoNear : {
              near : {
                  type:'Point',
                  coordinates: [lng*1,lat * 1]
              },
              distanceField :'distance'
          }
      }
  ])

  res.status(200).json({
    status:'success',
    results:tours.length,
    data:{
        data:distances
    }
    })
}