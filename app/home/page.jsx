"use client";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";

const AddForm = ({ onClose, onMemberAdded }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    try {
      if (!name || !age) {
        toast.error("Please fill in all fields");
        return;
      }

      setLoading(true);
      const response = await axios.post("/api/add-member", { name, age });

      if (response.status === 200) {
        toast.success(response?.data?.message || "Member added successfully");
        onMemberAdded();
        onClose();
      } else {
        toast.error(response?.data?.message || "Error adding member");
      }
    } catch (error) {
      console.error("Error in handleAdd:", error);
      toast.error(error?.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Add New Member
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter member name"
              type="text"
              className="border-2 border-gray-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter age"
              type="number"
              min="0"
              max="150"
              className="border-2 border-gray-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleAdd}
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Member"}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [members, setMembers] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/get_members");

      if (response.data.members && response.data.members.length > 0) {
        setMembers(response.data.members);
      } else {
        setMembers([]);
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to load members");
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleMemberAdded = () => {
    fetchMembers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Members
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Manage and view all members
              </p>
            </div>
            <button
              onClick={() => setShow(true)}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 sm:px-5 py-2.5 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 w-full sm:w-auto"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Member
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                Loading members...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded">
              <div className="flex items-start sm:items-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm sm:text-base text-red-700 font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && members.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-base sm:text-lg text-gray-500 font-medium mb-2">
                No members yet
              </p>
              <p className="text-sm sm:text-base text-gray-400">
                Click "Add Member" to get started
              </p>
            </div>
          )}

          {/* Members Grid */}
          {!loading && !error && members.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {members.map((m, i) => (
                <a
                  key={m._id || i}
                  href={`/test_categories?id=${m._id}`}
                  className="group block p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-gray-50 border-2 border-gray-200 rounded-lg transition-all duration-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                        {m.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Age: {m.age}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all flex-shrink-0 ml-2"
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
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="mt-12 sm:mt-0"
      />
      {show && (
        <AddForm
          onClose={() => setShow(false)}
          onMemberAdded={handleMemberAdded}
        />
      )}
    </div>
  );
};

export default HomePage;
