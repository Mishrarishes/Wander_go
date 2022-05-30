const User = require('./../../../models/usermodel')
const jwt = require('jsonwebtoken')
const {promisify} =require('util')
const { nextTick } = require('process')
const sendEmail = require('./../../../utils/email')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };
const createSendToken = (user, statusCode, res) => {
  try{const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    // Remove password from output
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });}
    catch(err){
      console.log(err);
    }
  
};
              exports.signup = async (req,res)=>{

                      const newUser = await User.create({
                          name:req.body.name,
                          email:req.body.email,
                          role:req.body.role,
                          password:req.body.password,
                          passwordConfirm: req.body.passwordConfirm
                      })

                      createSendToken(newUser,200,res);
                      }
exports.login = async (req, res, next) => {
const { email, password } = req.body;

// 1) Check if email and password exist
if (!email || !password) {
  return next(
    res.status(400).json({
      status:'fail',
      message:'Please provide email and password'
    })
  );
}
// 2) Check if user exists && password is correct
const user = await User.findOne({ email }).select('+password');

if (!user || !(await user.correctPassword(password, user.password))) {
  return next(
    res.status(401).json({
      status:'fail',
      message:'fill valid credentials hii'
    })
  );
}

// 3) If everything ok, send token to client
createSendToken(user, 200, res);
};

                        exports.logout = (req,res) =>{
                          res.cookie('jwt','loggedout',{
                            expires:new Date(Date.now() +10 * 1000),
                            httpOnly:true
                          })
                          res.status(200).json({
                            status:'success'
                          })
                        }

exports.protect = async (req,res,next)=>{
    // 1 get token if its there
    let token;
    if(req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')){
     token =req.headers.authorization.split(' ')[1];
    } else if(req.cookies.jwt) {
      token  = req.cookies.jwt
    }

   

    //console.log(token);
  if(!token){
    return next(res.status(400).json({
        status:'fail',
        message:'You are not logged in! Please Login'
    })
    );
  }
    //2 verification of the token
     const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
       // console.log(decoded);
    //3 check if user still exists
    const freshUser = await User.findById(decoded.id);
    if(!freshUser)
    {
        return next(res.status(400).json({
            status:'fail',
            message:'User belonging to token doesnt exist'
        })
        );
    }
    //4 check if user changed password after the token was issued
    if(freshUser.changedPasswordAfter(decoded.iat))
    return next(res.status(401).json({
        status:'fail',
        message:'User recently changed Password'
    })
    );
// Grant Access to protected mode
req.user = freshUser;
res.locals.user = freshUser;
   next();
}

// only for rendered pages, no errors
exports.isLoggedIn = async (req,res,next)=>{
 
 if(req.cookies.jwt) {
   try{
      //verify token
   const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)
   //3 check if user still exists
   const freshUser = await User.findById(decoded.id);
   if(!freshUser)
       return next();
   
   //4 check if user changed password after the token was issued
   if(freshUser.changedPasswordAfter(decoded.iat))
   return next();
 
 
 // There is  a logged in user
 res.locals.user = freshUser;
  return next();
   }
   catch(err){
       return next();
   }
}
next();
}

exports.restrictTo = (...roles) =>{
    return (req,res,next) =>{
        // roles ['admin','lead-guide]
        if(!roles.includes(req.user.role)){
            return next(res.status(403).json({
                status:'fail',
                message:'You do not have permission to perform thihs action'
            })
            ); 
        }
        next();
    }
}

exports.forgotPassword = async (req,res,next) =>{
// get user based on POSTed email
  const user =await User.findOne({
      email: req.body.email
  })
  if(!user)
  {
    return next(res.status(404).json({
        status:'fail',
        message:'There is No user with the email address'
    })
    ); 
  }
// generate random reset token
const resetToken = user.createPasswordResetToken();
await user.save({validateBeforeSave : false});
// send it to user's email
const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

const message = `Forgot ur password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you did not forget,ignore this email.`
try{
    await sendEmail({
        email: user.email,
        subject :'Your password rest token is valid for 10 min',
        message
    })
    res.status(200).json({
        status:'success',
        message:'Token sent to email'
    });
    
}catch(err){
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave:false});


    return next(res.status(500).json({
        status:'fail',
        message:'There is No user with the email address'
    })
    ); 
}

}

exports.resetPassword = (req,res,next) =>{}
    