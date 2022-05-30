const mongoose =require('mongoose')
const validator= require('validator')
const crypto = require('crypto')
const bcrypt =require('bcryptjs')
const userSchema =new mongoose.Schema({
    name:{
        type: String,
        required : [true,'user should have a name']
    },
    email:{
        type: String,
        required: [true,'user should have a email'],
        unique: true,
        lowercase: true,
        validate:[validator.isEmail, ' PLease provide a valid Email']
    },
    photo:String,
    role:{
        type:String,
        enum:['admin','guide','lead-guide','user'],
        default:'guide'
    },
    password:{
        type: String,
        required : [true,'user should have a password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type: String,
        required : [true,'Please confirm your password'],
        validate:{
            // this only works on save method  
            validator: function(el){
                 return  el === this.password;
            },
            message:'Password are not same'
        }
    },
    passwordChangedAt:Date,  // this property will only be there for users who have changed their password
    passwordResetToken : String,
    passwordResetExpires : Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
})
userSchema.pre('save',async function(next) {
    // only run this function if password was actually modified
    if(!this.isModified('password')) return next();
    
    //Hash the password with the cost of 12
   this.password = await bcrypt.hash(this.password,12)
    // Delete passwordConfirm field
   this.passwordConfirm = undefined;
   next();

})

userSchema.methods.correctPassword =async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        console.log(this.passwordChangedAt,JWTTimestamp);
        return JWTTimestamp<changedTimestamp;
    }

    // by default return false if user hasn't changed password
    return false;
}
userSchema.methods.createPasswordResetToken = function(){
   const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

   //console.log({resetToken},this.passwordResetToken);

   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
   return resetToken;
}
const User = mongoose.model('User',userSchema);
module.exports = User;