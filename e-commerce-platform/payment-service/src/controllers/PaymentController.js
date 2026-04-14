const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { SERVICES } = require('../../../shared/config/services');

class PaymentController {
  static async createPayment(req, res) {
    try {
      const { order_id, payment_method = 'card' } = req.body;

      // Get order total from order service
      const authHeader = req.headers.authorization;
      const orderResponse = await fetch(`${SERVICES.order.internalUrl}/orders/${order_id}`, {
        headers: authHeader ? { authorization: authHeader } : {}
      });
      if (!orderResponse.ok) {
        return res.status(400).json({ error: 'Order not found' });
      }
      const orderData = await orderResponse.json();
      const amount = orderData.order.total_amount;
      const id = uuidv4();

      await pool.execute(
        'INSERT INTO payments (id, order_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)',
        [id, order_id, amount, payment_method, 'processing']
      );

      // In real app, integrate with Stripe here
      // const stripe = require('stripe')(process.env.STRIPE_API_KEY);
      // const paymentIntent = await stripe.paymentIntents.create({...});

      res.status(201).json({
        message: 'Payment initiated',
        payment_id: id,
        status: 'processing'
      });
    } catch (error) {
      console.error('Create payment error:', error);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  }

  static async getPayment(req, res) {
    try {
      const { id } = req.params;

      const [payments] = await pool.execute(
        'SELECT * FROM payments WHERE id = ?',
        [id]
      );

      if (payments.length === 0) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.json({ payment: payments[0] });
    } catch (error) {
      console.error('Get payment error:', error);
      res.status(500).json({ error: 'Failed to get payment' });
    }
  }

  static async handleWebhook(req, res) {
    try {
      const stripe = require('stripe')(process.env.STRIPE_API_KEY);
      const sig = req.headers['stripe-signature'];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: 'Webhook signature verification failed' });
      }

      switch (event.type) {
        case 'payment_intent.succeeded':
          await pool.execute(
            'UPDATE payments SET status = ? WHERE stripe_payment_intent_id = ?',
            ['completed', event.data.object.id]
          );
          break;
        case 'payment_intent.payment_failed':
          await pool.execute(
            'UPDATE payments SET status = ? WHERE stripe_payment_intent_id = ?',
            ['failed', event.data.object.id]
          );
          break;
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({ error: 'Webhook error' });
    }
  }

  static async refundPayment(req, res) {
    try {
      const { payment_id, amount, reason } = req.body;

      // Check payment exists and is completed
      const [payments] = await pool.execute(
        'SELECT * FROM payments WHERE id = ? AND status = ?',
        [payment_id, 'completed']
      );

      if (payments.length === 0) {
        return res.status(400).json({ error: 'Payment not found or not eligible for refund' });
      }

      const refundAmount = amount || payments[0].amount;
      const id = uuidv4();

      await pool.execute(
        'INSERT INTO refunds (id, payment_id, amount, reason, status) VALUES (?, ?, ?, ?, ?)',
        [id, payment_id, refundAmount, reason, 'pending']
      );

      // Update payment status
      await pool.execute(
        'UPDATE payments SET status = ? WHERE id = ?',
        ['refunded', payment_id]
      );

      res.status(201).json({
        message: 'Refund initiated',
        refund_id: id,
        amount: refundAmount
      });
    } catch (error) {
      console.error('Refund error:', error);
      res.status(500).json({ error: 'Failed to process refund' });
    }
  }
}

module.exports = PaymentController;
