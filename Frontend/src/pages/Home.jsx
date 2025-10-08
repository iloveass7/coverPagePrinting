import React from 'react';
import '../App.css'; 

const Home = () => {
  return (
    <main className="relative flex-grow min-h-screen overflow-hidden">
      {/* Fullscreen background image */}
      <img
        src="/cover1.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full"
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
            className="text-[1.7rem] font-pixelify"
            style={{
              color: 'white',
              textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          </p>
        </div>

        <div className="max-w-8xl lg:mx-40">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <div className="aspect-[8.5/11] bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
              <p className="text-gray-500 text-[1.1rem] font-pixelify">
                Cover Page Preview
              </p>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-gray-100/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-gray-200/90 transition-colors duration-200 font-pixelify text-[1.1rem]">
              Download(PDF)
            </button>
            <button className="px-6 py-3 bg-gray-100/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-gray-200/90 transition-colors duration-200 font-pixelify text-[1.1rem]">
              Download(Word)
            </button>
            <button
              className="px-6 py-3 bg-green-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-green-700/90 transition-colors duration-200 font-pixelify text-[1.1rem]"
              style={{
                textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
              }}
            >
              Send Cover
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
