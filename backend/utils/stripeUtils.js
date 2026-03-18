const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET);

// ✅ Create Stripe Payment Intent
exports.createStripePaymentIntent = async (amount) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'inr',
    automatic_payment_methods: { enabled: true }
  });

  return paymentIntent;
};
