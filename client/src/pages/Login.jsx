import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('/api/auth/login', { email, password });


            if (res.data.user.role !== role) {
                setError(`Access Denied: You are not registered as a ${role}.`);
                setLoading(false);
                return;
            }

            login(res.data.token, res.data.user);

            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/my-donations');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">

            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-dark to-slate-900 z-0" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

                <div className="relative z-10 max-w-lg text-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 ring-1 ring-white/20">
                        <Lock className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        "Service to others is the rent you pay for your room here on earth."
                    </p>
                </div>
            </div>


            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-md w-full space-y-8 bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-slate-100"
                >
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Sign In</h2>
                        <p className="mt-2 text-sm text-slate-500">Access your dashboard</p>
                    </div>


                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setRole('user')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${role === 'user'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            User
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('admin')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${role === 'admin'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Admin
                        </button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center"
                        >
                            <span className="mr-2">⚠️</span> {error}
                        </motion.div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400"
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" className="w-full btn-primary py-3.5 text-lg shadow-xl shadow-primary/20 mt-4">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <p className="mt-8 text-center text-slate-500 font-medium">
                        Don't have an account? <Link to="/register" className="text-primary font-bold hover:text-primary-dark hover:underline transition-colors">Create one</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
