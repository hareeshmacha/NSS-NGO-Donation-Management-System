const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    console.log('Body:', req.body);
    next();
});


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ngo_donation_system', {
    serverSelectionTimeoutMS: 5000
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected');
});


app.use('/api/auth', require('./routes/auth'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
    res.send('NGO Donation System API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
