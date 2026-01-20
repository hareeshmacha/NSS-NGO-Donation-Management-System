const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Donation = require('./models/Donation');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
})
    .then(async () => {
        console.log('MongoDB Connected');
        try {
            const result = await Donation.updateMany(
                { status: 'pending' },
                { $set: { status: 'failed' } }
            );
            console.log(`Updated ${result.modifiedCount} donations from 'pending' to 'failed'.`);
            process.exit(0);
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    });
