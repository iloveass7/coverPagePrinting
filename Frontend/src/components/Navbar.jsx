import React, { useState } from 'react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-[#2B313D] shadow-sm py-5 top-0 z-50">
            <div className="max-w-8xl lg:mx-40 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <h1 className="text-[2.8rem] font-pixelify font-normal text-outline-2" style={{
                            color: 'white',
                            textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                        }}>
                            abcd.com
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <a
                                href="#"
                                className="text-gray-700 px-3 py-2 text-[1.7rem] font-normal font-pixelify transition-colors duration-200 hover:underline" style={{
                                    color: 'white',
                                    textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                                }}
                            >
                                Home
                            </a>
                            <a
                                href="#"
                                className="text-gray-700 px-3 py-2 text-[1.7rem] font-normal font-pixelify transition-colors duration-200 hover:underline" style={{
                                    color: 'white',
                                    textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                                }}
                            >
                                About Us
                            </a>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 py-3 rounded-md text-gray-100"
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Hamburger icon */}
                            <svg
                                className={`${isMenuOpen ? 'hidden' : 'block'} h-8 w-8`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                style={{
                                    filter: 'drop-shadow(-1px -1px 0 #000) drop-shadow(1px -1px 0 #000) drop-shadow(-1px 1px 0 #000) drop-shadow(1px 1px 0 #000)'
                                }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                            {/* Close icon with inline stroke effect */}
                            <svg
                                className={`${isMenuOpen ? 'block' : 'hidden'} h-8 w-8`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                style={{
                                    filter: 'drop-shadow(-1px -1px 0 #000) drop-shadow(1px -1px 0 #000) drop-shadow(-1px 1px 0 #000) drop-shadow(1px 1px 0 #000)'
                                }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-5 pb-1 space-y-1 sm:px-3 bg-[#2B313D] border-t border-gray-600">
                    <a
                        href="#"
                        className="block px-3 py-2 text-[1.6rem] font-normal font-pixelify transition-colors duration-200 hover:underline"
                        style={{
                            color: 'white',
                            textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                        }}
                    >
                        Home
                    </a>
                    <a
                        href="#"
                        className="block px-3 py-2 text-[1.6rem] font-normal font-pixelify transition-colors duration-200 hover:underline"
                        style={{
                            color: 'white',
                            textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                        }}
                    >
                        About Us
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
