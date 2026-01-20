import React from 'react';
import { Link } from 'react-router-dom';
import { LogoIITR, LogoNSS } from './Logos';
import AuthContext from '../context/AuthContext';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
    const { user } = React.useContext(AuthContext);

    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">


                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <LogoIITR className="h-12 w-12 grayscale hover:grayscale-0 transition-all duration-300 bg-white/10 rounded-full p-1" />
                            <LogoNSS className="h-12 w-12 grayscale hover:grayscale-0 transition-all duration-300 bg-white/10 rounded-full p-1" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">NSS IIT Roorkee</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Empowering youth to serve the community. Not Me, But You.
                                Join us in making a difference today.
                            </p>
                        </div>

                    </div>


                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
                        <ul className="space-y-4">


                            {(!user || user.role !== 'admin') && (
                                <FooterLink to="/donate" text="Donate" />
                            )}
                            {!user && (
                                <>
                                    <FooterLink to="/login" text="Login" />
                                    <FooterLink to="/register" text="Join NSS" />
                                </>
                            )}
                        </ul>
                    </div>





                    {(!user || user.role !== 'admin') && (
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-6">Make an Impact</h4>
                            <p className="text-slate-400 text-sm mb-4">
                                Your contribution can change lives. Support our initiatives today.
                            </p>
                            <Link
                                to="/donate"
                                className="inline-flex items-center justify-center w-full px-6 py-3 bg-secondary hover:bg-secondary-dark text-white rounded-xl font-semibold transition-all shadow-lg shadow-secondary/20 hover:-translate-y-1"
                            >
                                <Heart className="h-4 w-4 mr-2" fill="currentColor" />
                                Donate Now
                            </Link>
                        </div>
                    )}
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} NSS IIT Roorkee. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon }) => (
    <a
        href={href}
        className="h-10 w-10 bg-slate-800 flex items-center justify-center rounded-lg text-slate-400 hover:bg-primary hover:text-white transition-all duration-300"
    >
        {icon}
    </a>
);

const FooterLink = ({ to, text }) => (
    <li>
        <Link to={to} className="text-slate-400 hover:text-white transition-colors hover:translate-x-1 inline-block">
            {text}
        </Link>
    </li>
);

export default Footer;
