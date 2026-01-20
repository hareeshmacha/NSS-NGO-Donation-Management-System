import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Shield, ArrowRight, HeartHandshake } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user', adminSecretKey: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { name, email, password, role, adminSecretKey } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('/api/auth/register', formData);
            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err) {
            console.error("Registration Error:", err);
            console.error("Registration Error:", err);
            setError(err.response?.data?.msg || err.message || 'Registration Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">

            <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-dark to-slate-900 z-0" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                            <HeartHandshake className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold mb-6 leading-tight">Join a Community of Changemakers</h1>
                        <p className="text-lg text-slate-100 leading-relaxed mb-8">
                            "The best way to find yourself is to lose yourself in the service of others."
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 text-slate-100">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">1</div>
                                <span>Create your impact profile</span>
                            </div>
                            <div className="flex items-center space-x-4 text-slate-100">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">2</div>
                                <span>Track your donations in real-time</span>
                            </div>
                            <div className="flex items-center space-x-4 text-slate-100">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">3</div>
                                <span>Join exclusive community events</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>


            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                <div className="max-w-md w-full">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-slate-100"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
                            <p className="text-slate-500 mt-2">Start your journey with us today</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center"
                            >
                                <span className="mr-2">⚠️</span> {error}
                            </motion.div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={name}
                                        onChange={onChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={onChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 ml-1">I want to join as</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'user' })}
                                        className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all ${role === 'user'
                                            ? 'border-primary bg-blue-50 text-primary font-bold'
                                            : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                            }`}
                                    >
                                        Donor
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'admin' })}
                                        className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all ${role === 'admin'
                                            ? 'border-primary bg-blue-50 text-primary font-bold'
                                            : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                            }`}
                                    >
                                        Admin
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {role === 'admin' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="space-y-1 pt-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Admin Verification Key</label>
                                            <div className="relative">
                                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                                                <input
                                                    type="password"
                                                    name="adminSecretKey"
                                                    value={adminSecretKey}
                                                    onChange={onChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-blue-50 border border-blue-100 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all text-slate-900 placeholder:text-blue-300"
                                                    placeholder="Enter secret key"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 text-lg shadow-lg shadow-primary/30 mt-6 flex items-center justify-center group"
                            >
                                {loading ? 'Creating Account...' : 'Get Started'}
                                {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-slate-500 font-medium">
                            Already a member? <Link to="/login" className="text-primary font-bold hover:text-primary-dark hover:underline transition-colors">Sign in here</Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Register;
