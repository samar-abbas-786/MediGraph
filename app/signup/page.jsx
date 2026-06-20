"use client";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/signup", { email, password });

      if (res.status === 200 || res.status === 201) {
        toast.success("Verification email sent! Please check your inbox.");
        setVerificationSent(true);
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Something went wrong. Try again!";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Image Section */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-100 to-blue-200 items-center justify-center p-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
            alt="Signup Illustration"
            className="w-64 drop-shadow-lg"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          {!verificationSent ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-1">
                Create Account
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Sign up to get started
              </p>

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Create password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95"
                >
                  {isLoading ? "Sending..." : "Sign Up"}
                </button>

                <Link
                  href="/login"
                  className="text-blue-600 text-xs text-center md:text-sm hover:underline"
                >
                  Already have an account? Login
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <div className="inline-block p-3 bg-green-100 rounded-full">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Verification Email Sent!
              </h2>
              <p className="text-gray-600 mb-4">
                We've sent a verification link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Please check your email and click the verification link to
                complete your registration. The link expires in 24 hours.
              </p>
              <button
                onClick={() => setVerificationSent(false)}
                className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
              >
                Back to Sign Up
              </button>
              <p className="text-xs text-gray-500 mt-4">
                Didn't receive an email? Check your spam folder or{" "}
                <button
                  onClick={() => setVerificationSent(false)}
                  className="text-blue-600 hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
