import React from 'react';

const App = () => {
  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="text-white text-2xl font-bold">aDApt</div>
          </div>
          <ul className="flex space-x-8">
            <li><a href="#" className="text-white hover:text-gray-300">Home</a></li>
            <li><a href="#features" className="text-white hover:text-gray-300">Features</a></li>
            <li><a href="#about" className="text-white hover:text-gray-300">About</a></li>
            <li><a href="#contact" className="text-white hover:text-gray-300">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Welcome to aDApt</h1>
          <p className="text-lg md:text-xl mb-8">A collaborative platform for students!</p>
          <a href="#features" className="bg-orange-500 px-6 py-3 rounded-full text-lg hover:bg-orange-400 transition">Learn More</a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-gray-200 p-8 rounded-lg shadow-lg hover:bg-gray-300 transition">
              <h3 className="text-xl font-semibold mb-4">Feature 1</h3>
            </div>
            <div className="bg-gray-200 p-8 rounded-lg shadow-lg hover:bg-gray-300 transition">
              <h3 className="text-xl font-semibold mb-4">Feature 2</h3>
            </div>
            <div className="bg-gray-200 p-8 rounded-lg shadow-lg hover:bg-gray-300 transition">
              <h3 className="text-xl font-semibold mb-4">Feature 3</h3>
            </div>
            <div className="bg-gray-200 p-8 rounded-lg shadow-lg hover:bg-gray-300 transition">
              <h3 className="text-xl font-semibold mb-4">Feature 4</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-600 text-white py-4 text-center">
        <p>&copy; 2024 aDApt. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
