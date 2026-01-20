const axios = require('axios');

async function createTestAccounts() {
    const baseURL = 'http://localhost:5000/api/auth/register';


    const user = {
        name: "Test Regular User",
        email: "user@test.com",
        password: "password123",
        role: "user"
    };


    const admin = {
        name: "Test Admin User",
        email: "admin@test.com",
        password: "password123",
        role: "admin",
        adminSecretKey: "admin123"
    };

    try {
        console.log("Creating User...");
        await axios.post(baseURL, user);
        console.log("User created: user@test.com / password123");
    } catch (err) {
        console.log("User creation failed (might already exist):", err.response?.data?.msg || err.message);
    }

    try {
        console.log("Creating Admin...");
        await axios.post(baseURL, admin);
        console.log("Admin created: admin@test.com / password123");
    } catch (err) {
        console.log("Admin creation failed (might already exist):", err.response?.data?.msg || err.message);
    }
}

createTestAccounts();
