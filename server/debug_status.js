const mongoose = require('mongoose');
const Donation = require('./models/Donation');
const User = require('./models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function verifyDonationCreation() {
    try {
        console.log('Connecting to:', process.env.MONGO_URI || 'mongodb://localhost:27017/ngo_donation_system');

        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ngo_donation_system', {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Connected to DB');

        const pendingCount = await Donation.countDocuments({ status: 'pending' });
        const failedCount = await Donation.countDocuments({ status: 'failed' });
        const successCount = await Donation.countDocuments({ status: 'success' });

        console.log(`Donation Counts - Pending: ${pendingCount}, Failed: ${failedCount}, Success: ${successCount}`);

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        mongoose.disconnect();
    }
}

verifyDonationCreation();
