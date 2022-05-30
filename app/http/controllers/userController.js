
const User = require('./../../../models/usermodel')

const filterObj = (obj, ...allowedFields) =>{
    const newObj={};
    Object.keys(obj).forEach(el =>{
        if(allowedFields.includes(el)) newObj[el]= obj[el];
    });
}

exports.getAllUsers = async (req,res) =>{
   try{

    const users = await User.find();

    res.status(200).json({
        status :'success',
        data : {
            users
        }
    });
   } catch(err){
       res.status(400).json({
           status:'fail',
           message:err
       })
   }
}

exports.updateMe =async (req,res,next) =>{
    // Create error if updates password
    if(req.body.password || req.body.passwordConfirm)
    {
        return next(
            (req,res)=>{
                res.status(400).json(
                    {
                     staus:'fail',
                     message:'Dont update password here'   
                    }
                )
            }
        )
    }
    //2 filter out unwanted field names which are not allowed to update
    const filteredBody = filterObj(req.body, 'name','email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,
        {
            new:true ,
            runValidators:true
        });
    res.status(200).json({
        status:'success',
        data:{
            user :updatedUser
        }
    })
}

exports.deleteMe = async (req,res,next)=>{
    await User.findByIdAndDelete(
        req.user.id, {active:false}
    )
    res.status(204).json({
        status:'success',
        data:null
    })
}

exports.getMe = (req,res,next)=>{
    req.params.id = req.user.id;
    next();
}

exports.getUser = async (req,res) =>{

    try{
        const user = await User.findById(req.params.id);
        res.status(200).json({
            status: 'succes',
           data:{
               user
           }
        })
      
    }catch(err){
        res.status(404).json({
            status: 'error',
            message:err
        })
    }
    
}
exports.updateUser = (req,res) =>{
    res.status(500).json({
        status: 'error',
        message : 'this route is not yet defined'
    })
}
exports.createUser = (req,res) =>{
    res.status(500).json({
        status: 'error',
        message : 'this route is not yet defined'
    })
}
exports.deleteUser = (req,res) =>{
    res.status(500).json({
        status: 'error',
        message : 'this route is not yet defined'
    })
}
