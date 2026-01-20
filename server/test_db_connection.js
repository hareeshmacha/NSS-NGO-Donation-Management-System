const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('Testing MongoDB Connection...');
console.log('URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => {
        console.log('SUCCESS: MongoDB Connected!');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: MongoDB Connection Error:', err.message);
        process.exit(1);
    });
