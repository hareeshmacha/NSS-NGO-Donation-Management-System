const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Donation = require('../models/Donation');

const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Admin access denied' });
    }
    next();
};


router.get('/stats', auth, adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });


        const donationStats = await Donation.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $match: {
                    "user.role": "user",
                    "status": "success"
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const totalDonations = donationStats.length > 0 ? donationStats[0].count : 0;
        const totalAmount = donationStats.length > 0 ? donationStats[0].totalAmount : 0;

        res.json({
            totalUsers,
            totalDonations,
            totalAmount
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.get('/users', auth, adminAuth, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.get('/administrators', auth, adminAuth, async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-password').sort({ createdAt: -1 });
        res.json(admins);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.get('/donations', auth, adminAuth, async (req, res) => {
    try {
        const donations = await Donation.find().populate('userId', 'name email role').sort({ createdAt: -1 });
        const userDonations = donations.filter(d => d.userId && d.userId.role === 'user');
        res.json(userDonations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
