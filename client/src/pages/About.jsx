import React from 'react';

const About = () => {
  return (
    <div className="bg-slate-900 text-white min-h-screen py-12 px-4 font-roboto">
      <div className="max-w-screen-xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-100">About CPP</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">Your destination for mastering competitive programming</p>
        </div>

        {/* Introduction */}
        <div className="bg-slate-800 p-6 sm:p-8 rounded-lg shadow-lg mb-12">
          <h4 className="text-base sm:text-lg font-semibold text-slate-200">What is CP?</h4>
          <p className="text-slate-400 mt-4 text-xs sm:text-sm">
            CP is a cutting-edge online platform designed to help competitive programmers of all skill levels
            improve their coding abilities. With a vast array of problems, tutorials, and community-driven discussions,
            CP is your go-to resource for mastering algorithms, data structures, and more.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-slate-800 p-6 sm:p-8 rounded-lg shadow-lg mb-12">
          <h4 className="text-base sm:text-lg font-semibold text-slate-200">Our Mission</h4>
          <p className="text-slate-400 mt-4 text-xs sm:text-sm">
            Our mission is to provide a seamless learning experience where coders can sharpen their problem-solving
            skills, build a strong foundation in algorithms and data structures, and grow within a supportive community.
            Whether you’re just starting out or preparing for coding competitions, CPm aims to help you achieve
            your goals.
          </p>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h4 className="text-base sm:text-lg font-semibold text-slate-200">Meet the Team</h4>
          <p className="text-slate-400 mt-2 text-xs sm:text-sm">Our passionate team is committed to building the best coding platform.</p>
        </div>

        <div className="flex justify-center">
          {/* Team Member - Mahesh Krishnam */}
          <div className="bg-slate-800 py-6 px-14 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out hover:bg-slate-700 hover:shadow-xl">
            <img
              src="https://via.placeholder.com/150"
              alt="Mahesh Krishnam"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-600"
            />
            <h4 className="text-xs sm:text-sm font-semibold text-slate-200">Mahesh Krishnam</h4>
            <p className="text-slate-400 mt-2 text-xs sm:text-sm">Developer</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h4 className="text-base sm:text-lg font-semibold text-slate-200">Join Us in the Journey</h4>
          <p className="text-slate-400 mt-2 text-xs sm:text-sm">
            Whether you're a beginner or an expert, CP has something for everyone. Start your coding journey with us today!
          </p>
          <a
            href="/signup"
            className="inline-block mt-6 px-6 py-3 bg-slate-700 text-white rounded-full hover:bg-slate-600 transition duration-300 text-xs sm:text-sm"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
