import React from 'react';
import logo from '../assets/images/logo.jpg';

const Navbar = () => {
    return (
        <nav className='h-16 w-full fcc bg-secondary shadow-lg fixed z-30'>
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-800 w-14 h-14 overflow-hidden shadow-2xl fcc">
                    <img src={logo} alt="Logo" />
                </div>
                <p className='font-bold'>My E-Commerce App</p>
            </div>
        </nav>
    );
};

export default Navbar;
