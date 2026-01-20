import React from 'react';
import iitrLogo from '../assets/iitr_logo.png';
import nssLogo from '../assets/nss_logo.png';

export const LogoIITR = ({ className = "h-12 w-12" }) => (
    <div className={`relative flex items-center justify-center ${className}`}>
        <img
            src={iitrLogo}
            alt="IIT Roorkee Logo"
            className="w-full h-full object-contain drop-shadow-sm filter hover:brightness-110 transition-all"
        />
    </div>
);

export const LogoNSS = ({ className = "h-12 w-12" }) => (
    <div className={`relative flex items-center justify-center ${className}`}>
        <img
            src={nssLogo}
            alt="NSS Logo"
            className="w-full h-full object-contain drop-shadow-sm filter hover:brightness-110 transition-all"
        />
    </div>
);
