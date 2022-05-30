
const port =3000 || process.env.PORT
const dotenv = require('dotenv');
const app =require('./app');
const { default: mongoose } = require('mongoose');

dotenv.config({ path : './config.env'})
const DB = process.env.DATABASE_LINK;

 mongoose.connect(DB, {
  }, err =>{
    if(err) throw err;
    console.log('dB connected');
  });


app.listen(port,()=>{
    console.log(`server listening at port ${port}`)
})