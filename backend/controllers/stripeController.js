const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET);

// ✅ Create Stripe Payment
exports.createStripePayment = async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount * 100,
    currency: 'inr'
  });

  res.json(paymentIntent);
};
