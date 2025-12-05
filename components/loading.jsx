import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="w-16 h-16 border-4 border-blue-300 border-t-transparent border-t-4 border-l-4 border-r-4 rounded-full animate-spin mb-4 bg-gradient-to-r from-blue-400 to-blue-600"></div>

      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce animation-delay-150"></span>
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce animation-delay-300"></span>
      </div>

      <p className="mt-4 text-blue-700 font-medium text-lg">Loading...</p>
    </div>
  );
};

export default Loading;
