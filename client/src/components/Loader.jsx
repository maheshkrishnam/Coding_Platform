import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-slate-700 rounded-lg">
      {/* Loader Container */}
      <div className="relative flex items-center space-x-3">
        {/* Dot 1 */}
        <div className="w-4 h-4 bg-indigo-500 rounded-full animate-wave1"></div>
        
        {/* Dot 2 */}
        <div className="w-4 h-4 bg-indigo-500 rounded-full animate-wave2"></div>
        
        {/* Dot 3 */}
        <div className="w-4 h-4 bg-indigo-500 rounded-full animate-wave3"></div>
        
        {/* Dot 4 */}
        <div className="w-4 h-4 bg-indigo-500 rounded-full animate-wave4"></div>

        {/* Dot 5 */}
        <div className="w-4 h-4 bg-indigo-500 rounded-full animate-wave5"></div>
      </div>

      {/* "Loading..." Text */}
      <div className="absolute text-white text-xl font-semibold mt-32 animate-fadeIn">Loading...</div>

      {/* Custom Animations */}
      <style>{`
        @keyframes wave {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px); /* Reduced vertical movement */
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        /* Animation for the dots to create a wavy effect */
        .animate-wave1 {
          animation: wave 1s ease-in-out infinite;
        }
        
        .animate-wave2 {
          animation: wave 1s ease-in-out 0.2s infinite;
        }

        .animate-wave3 {
          animation: wave 1s ease-in-out 0.4s infinite;
        }

        .animate-wave4 {
          animation: wave 1s ease-in-out 0.6s infinite;
        }

        .animate-wave5 {
          animation: wave 1s ease-in-out 0.8s infinite; /* Additional circle with a delayed animation */
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Loader;
