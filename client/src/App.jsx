import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Donate from './pages/Donate';
import MyDonations from './pages/MyDonations';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';


import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <AuthProvider>

        <div className="min-h-screen flex flex-col font-sans text-slate-900">
          <Navbar />
          <div className="flex-grow pt-24">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/my-donations" element={
                <ProtectedRoute>
                  <MyDonations />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute roleRequired="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
