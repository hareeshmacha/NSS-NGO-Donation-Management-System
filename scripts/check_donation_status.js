const mongoose = require('mongoose');
const Donation = require('./server/models/Donation');
const User = require('./server/models/User');
require('dotenv').config({ path: './server/.env' });

async function verifyDonationCreation() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ngo_donation_system');
        console.log('Connected to DB');


        console.log('Donation Schema Default Status:', Donation.schema.path('status').defaultValue);


        const pendingCount = await Donation.countDocuments({ status: 'pending' });
        const failedCount = await Donation.countDocuments({ status: 'failed' });
        const successCount = await Donation.countDocuments({ status: 'success' });

        console.log(`Donation Counts - Pending: ${pendingCount}, Failed: ${failedCount}, Success: ${successCount}`);

        mongoose.disconnect();
    } catch (error) {
        console.error(error);
        mongoose.disconnect();
    }
}

verifyDonationCreation();
