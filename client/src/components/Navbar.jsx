import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Heart, Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { LogoIITR, LogoNSS } from './Logos';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-primary/10 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24">
                    <Link to="/" className="flex items-center space-x-4 group">
                        <div className="flex items-center space-x-2">
                            <LogoIITR className="h-14 w-14 transition-transform duration-300 group-hover:scale-105" />
                            <div className="h-10 w-px bg-slate-300 mx-1"></div>
                            <LogoNSS className="h-14 w-14 transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-primary-dark tracking-tight leading-none group-hover:text-primary transition-colors">
                                NSS IIT Roorkee
                            </span>
                            <span className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                                NGO Registration & Donation System
                            </span>
                        </div>
                    </Link>


                    <div className="hidden md:flex items-center space-x-1">

                        {user && (
                            <NavLink
                                to={user.role === 'admin' ? '/admin' : '/my-donations'}
                                active={isActive(user.role === 'admin' ? '/admin' : '/my-donations')}
                            >
                                {user.role === 'admin' ? 'Dashboard' : 'My Donations'}
                            </NavLink>
                        )}
                        {(!user || user.role !== 'admin') && (
                            <NavLink to="/donate" active={isActive('/donate')}>Donate</NavLink>
                        )}

                        <div className="w-px h-6 bg-slate-200 mx-4" />

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 pl-2">
                                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <User className="h-5 w-5" />
                                    </div>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100">
                                    <div className="px-4 py-2 border-b border-slate-50">
                                        <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    <Link to={user.role === 'admin' ? '/admin' : '/my-donations'} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 font-medium flex items-center">
                                        <LayoutDashboard className="h-4 w-4 mr-2" />
                                        <span>{user.role === 'admin' ? 'Dashboard' : 'My Donations'}</span>
                                    </Link>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-medium flex items-center">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 ml-2">
                                <Link to="/login" className="px-5 py-2.5 rounded-full text-slate-600 font-medium hover:bg-slate-50 transition-colors">Log In</Link>
                                <Link to="/register" className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-0.5">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>


                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 hover:text-primary focus:outline-none rounded-lg hover:bg-slate-50 transition-colors">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>


                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 overflow-hidden"
                        >
                            <div className="px-4 py-6 space-y-4">
                                <Link to="/" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-600 hover:text-primary">Home</Link>
                                {(!user || user.role !== 'admin') && (
                                    <Link to="/donate" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-600 hover:text-primary">Donate</Link>
                                )}
                                {user ? (
                                    <>
                                        <Link to={user.role === 'admin' ? '/admin' : '/my-donations'} onClick={() => setIsOpen(false)} className="block text-lg font-medium text-slate-600 hover:text-primary">
                                            {user.role === 'admin' ? 'Dashboard' : 'My Donations'}
                                        </Link>
                                        <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left py-2 text-red-500 font-medium">Log Out</button>
                                    </>
                                ) : (
                                    <div className="pt-4 flex flex-col space-y-3">
                                        <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:border-primary hover:text-primary transition-colors">Log In</Link>
                                        <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center py-3 rounded-xl bg-primary text-white font-medium shadow-lg shadow-primary/30">Get Started</Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link to={to} className={`relative px-4 py-2 rounded-full font-medium transition-all duration-300 ${active ? 'text-primary bg-primary/10' : 'text-slate-500 hover:text-primary hover:bg-slate-50/50'}`}>
        {children}
    </Link>
);

export default Navbar;
