const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// Utility to mask card number
const maskCardNumber = (cardNumber) => {
  const clean = cardNumber.replace(/\s+/g, '');
  const last4 = clean.slice(-4);
  return '**** **** **** ' + last4;
};

// ➕ CREATE a payment
router.post('/', async (req, res) => {
  try {
    const { card, products, totalAmount } = req.body;

    const payment = new Payment({
      card,
      products,
      totalAmount,
      status: 'success', // Simulate a successful payment
    });

    await payment.save();
    res.status(201).json({ message: 'Payment created', payment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment', details: error.message });
  }
});

// 📥 READ all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find();

    const masked = payments.map(payment => {
      if (payment.card?.cardNumber) {
        payment.card.cardNumber = maskCardNumber(payment.card.cardNumber);
      }
      return payment;
    });

    res.json(masked);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// 📥 READ payment by ID
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    if (payment.card?.cardNumber) {
      payment.card.cardNumber = maskCardNumber(payment.card.cardNumber);
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// ✏️ UPDATE payment by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Payment not found' });

    if (updated.card?.cardNumber) {
      updated.card.cardNumber = maskCardNumber(updated.card.cardNumber);
    }

    res.json({ message: 'Payment updated', payment: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// ❌ DELETE payment by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Payment not found' });

    res.json({ message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

module.exports = router;
