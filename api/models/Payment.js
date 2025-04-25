const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  cardHolderName: String,
  cardNumber: String,
  expiryMonth: String,
  expiryYear: String,
  cvv: String,
});

const productSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  quantity: Number,
});

const paymentSchema = new mongoose.Schema({
  userId: {
    type: Number,
    default: 1, 
  },
  card: cardSchema,
  products: [productSchema],
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
