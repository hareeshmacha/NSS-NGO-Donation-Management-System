const axios = require('axios');

async function testRegistration() {
    try {
        console.log('Testing Registration...');
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            name: "Test User",
            email: "testuser" + Math.floor(Math.random() * 1000) + "@example.com",
            password: "password123",
            role: "user"
        });
        console.log('Registration Success:', res.data);
    } catch (err) {
        console.error('Registration Failed:', err.response ? err.response.data : err.message);
    }
}

testRegistration();
