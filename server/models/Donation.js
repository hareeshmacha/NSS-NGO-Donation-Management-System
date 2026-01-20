const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'INR',
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending',
    },
    paymentGatewayId: {
        type: String,
    },
    paymentId: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);
