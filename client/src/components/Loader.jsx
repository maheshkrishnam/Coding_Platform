// Loader.js
import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-400 border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
