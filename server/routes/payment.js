const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


router.post('/create-order', auth, async (req, res) => {
    const { amount, currency = 'INR' } = req.body;

    try {
        const options = {
            amount: amount * 100,
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) return res.status(500).send('Some error occured');


        const donation = new Donation({
            userId: req.user.id,
            amount,
            currency,
            paymentGatewayId: order.id,
            status: 'pending',
        });

        await donation.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});


router.post('/verify', auth, async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {

        try {
            const donation = await Donation.findOne({ paymentGatewayId: razorpay_order_id });
            if (donation) {
                donation.status = 'success';
                donation.paymentId = razorpay_payment_id;
                await donation.save();
            }
            res.json({ msg: 'Payment Success', paymentId: razorpay_payment_id });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating donation');
        }
    } else {

        try {
            const donation = await Donation.findOne({ paymentGatewayId: razorpay_order_id });
            if (donation) {
                donation.status = 'failed';
                await donation.save();
            }
        } catch (err) { console.error(err); }

        res.status(400).json({ msg: 'Invalid Signature' });
    }
});


router.get('/my-donations', auth, async (req, res) => {
    try {
        const donations = await Donation.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(donations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
