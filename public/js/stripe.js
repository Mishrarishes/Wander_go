const stripe = Stripe('pk_test_51L58TdSFDX00PJqVPEL0CKRkMu3acn6wxlhM1mWphzI5dqCjMcoDxle0FcyCUrsJigRW19bPOu2gMJB7EszaetMB00E0itlm7U')
import axios from 'axios'

export const bookTour = async tourId =>{
    // 1 Get checkout Session from API
    const session = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/tourId`)
    

    // create checkout form 
}