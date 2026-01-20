# NSS/NGO Donation Management System

A full-stack web application designed to facilitate and manage donations for NSS/NGO organizations using the MERN stack. This system provides a secure platform for donors to contribute funds and gives administrators powerful tools to track and manage these donations.

##  Features

- **User Authentication**: Secure Sign Up and Login for Users and Admins.
- **Role-Based Access**: Distinct dashboards and features for Regular Users and Administrators.
- **Donation Processing**: Seamless integration with **Razorpay** for handling real-time payments.
- **Donation History**: Users can view their complete donation history with status tracking.
- **Admin Dashboard**: Visual analytics (Total Funds, User Count, Donation Trends) using charts.
- **Responsive Design**: Fully responsive UI built with **Tailwind CSS**.

##  Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, BcryptJS
- **Payment Gateway**: Razorpay

##  Usage & Installation

### Prerequisites

- Node.js installed
- MongoDB installed locally or a MongoDB Atlas connection string
- Razorpay Account (Key ID and Key Secret)

### 1. Clone the Repository

```bash
git clone https://github.com/hareeshmacha/NSS-NGO-Donation-Management-System.git
cd NSS-NGO-Donation-Management-System
```

### 2. Backend Setup (Server)

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_SECRET_KEY=your_admin_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the server:

```bash
npm start
# or for development
npm run dev
```

### 3. Frontend Setup (Client)

Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd client
npm install
```

Start the React development server:

```bash
npm run dev
```

The application will launch at `http://localhost:5173` (or the port shown in your terminal).

##  Authors

- **Macha Hareesh**
- **Ajay**
- **Reddy thanuj royaj**


