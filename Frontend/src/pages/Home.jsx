import React from 'react';
import '../App.css'; 
import Form from '../components/Form';

const Home = () => {
  return (
    <main className="relative flex-grow min-h-screen overflow-hidden">
      {/* Fullscreen background image */}
      <img
        src="/cover2.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay content */}
      <div className="relative container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1
            className="text-[3.6rem] font-pixelify font-normal mb-4"
            style={{
              color: 'white',
              textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
            }}
          >
            Generate Your Cover Page Now!
          </h1>
          <p
            className="text-[1.9rem] font-pixelify"
            style={{
              color: 'white',
              textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.
          </p>
        </div>

        {/* Form Component */}
        <Form />
      </div>
    </main>
  );
};

export default Home;
