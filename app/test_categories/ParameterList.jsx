const ParameterList = ({ category, onSelectParameter, onBack }) => {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Parameters in: {category.category}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Select a parameter to view its graph
        </p>
      </div>

      {/* Parameter Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {category.parameters.map((param, i) => (
          <div
            key={i}
            onClick={() => onSelectParameter(param)}
            className="group cursor-pointer p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-gray-50 border-2 border-gray-200 rounded-lg transition-all duration-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-blue-600 transition-colors truncate pr-2">
                {param}
              </span>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
      >
        ← Back
      </button>
    </div>
  );
};

export default ParameterList;
