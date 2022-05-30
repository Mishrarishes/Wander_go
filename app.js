const express = require('express')
const path =require('path')
const app =express()
const cookieParser = require('cookie-parser')
const tourRouter = require('./routes/tours')
const userRouter = require('./routes/users')
const reviewRouter = require('./routes/reviews')
const bookingRouter = require('./routes/bookings')
const viewRouter = require('./routes/views')

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'))

app.use(express.json()) // we use this in order to use req.body feature in POST request
app.use(express.static(path.join(__dirname,'/public')))

app.use(cookieParser());


app.use( (req,res,next)=>{
    console.log(req.cookies);
    next();
})


app.use('/',viewRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/bookings',bookingRouter)



module.exports =app;