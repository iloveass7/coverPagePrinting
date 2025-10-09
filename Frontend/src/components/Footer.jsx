import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#000000] text-white mt-auto">
      <div className="max-w-8xl lg:mx-40 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section - Logo and Description */}
          <div>
            <h2 className="text-[2.4rem] font-pixelify font-normal mb-4" style={{
              color: 'white',
              textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
            }}>
              abcd.com
            </h2>
            <p className="text-[1.3rem] font-pixelify leading-relaxed max-w-2xl"style={{
              color: 'white',
              textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
            }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore 
              magna aliqua. Ut enim ad minim veniam, quis nostrud
            </p>
          </div>

          {/* Right Section - Contact Information */}
          <div className="md:text-right">
            <h3 className="text-[2.0rem] font-pixelify font-normal mt-1 mb-4" style={{
              color: 'white',
              textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
            }}>
              Contact Us
            </h3>
            <div className="space-y-2 text-[1.2rem] font-pixelify text-gray-300">
              <p className="hover:underline cursor-pointer transition-colors duration-200" style={{
                color: 'white',
                textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
              }}>
                abcd.facebook.com
              </p>
              <p className="hover:underline cursor-pointer transition-colors duration-200" style={{
                color: 'white',
                textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
              }}>
                abcd.gmail.com
              </p>
              <p className="hover:underline cursor-pointer transition-colors duration-200" style={{
                color: 'white',
                textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
              }}>
                abcd.whatsapp.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-500 mt-8 pt-4">
          <p className="text-center text-[1.0rem]"style={{
                color: 'white',
                textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
              }}>
            © 2024 abcd.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
