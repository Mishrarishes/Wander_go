const Tour = require("../../../models/tourmodel")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.getCheckoutSession = async (req,res,next)=>{
    //get the currently booked tour
    const tour = await Tour.findById(req.params.id);
    
    // create the checkout session
   const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email:req.user.email,
        client_reference_id:req.params.tourId,
        line_items:[
            {
                name:`${tour.name} Tour`,
                description: tour.summary,
                images:[
                    `http://localhost:3000/img/tours/tour-3-cover.jpg`
                ],
                amount:tour.price * 100,
                currency :'usd',
                quantity:1
            }
        ]
    })
   

    ///send it to the client
    res.status(200).json({
        status:'success',
        session
    })
}