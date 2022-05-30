const fs=require('fs')
const path=require('path')
const Tour=require('./../../models/tourmodel')
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');
const Review = require('./../../models/reviewModel')
const User = require('./../../models/usermodel')

dotenv.config({ path : './config.env'})
const DB = process.env.DATABASE_LINK;

 mongoose.connect(DB, {
  }, err =>{
    if(err) throw err;
    console.log('dB connected');
  });

  //Read JSON File
  const tours = JSON.parse(fs.readFileSync(path.join(__dirname,'tours.json'),'utf-8'));
  const users = JSON.parse(fs.readFileSync(path.join(__dirname,'users.json'),'utf-8'));
  const reviews = JSON.parse(fs.readFileSync(path.join(__dirname,'reviews.json'),'utf-8'));
  // IMPORT DATA INTO DATABASE
  const importData = async ()=>{
      try{
         await Tour.create(tours)
         await User.create(users,{validateBeforeSave:false })
         await Review.create(reviews)
         console.log('Data Successfully loaded!')
        
      }
      catch(err){
        console.log(err)
      }
      process.exit()
  }

  //Delete all the data from DB
  const deleteData =async ()=>{
    try{
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('Data deleted successfully')
       
     }
     catch(err){
       console.log(err)
     }
     process.exit()
  }
  if(process.argv[2] === '--import')
  {
      importData();
  }
  else if(process.argv[2] ==='--delete')
  {deleteData();}
