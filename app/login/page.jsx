"use client";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Forgot Password state ──────────────────────────────────────
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/login", { email, password });
      if (res.status === 200) {
        toast.success(res.data.message);
        setTimeout(() => router.push("/home"), 500);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Something went wrong. Try again!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email address");
      return;
    }
    setForgotLoading(true);
    try {
      await axios.post("/api/forgot-password", { email: forgotEmail });
      setForgotSent(true);
    } catch (error) {
      const msg =
        error.response?.data?.message || "Something went wrong. Try again!";
      toast.error(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail("");
    setForgotSent(false);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Image Section */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-100 to-blue-200 items-center justify-center p-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
              alt="Login Illustration"
              className="w-64 drop-shadow-lg"
            />
          </div>

          {/* Right Form Section */}
          <div className="w-full md:w-1/2 p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-1">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500 mb-6">Login to continue</p>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-11 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95"
              >
                {loading ? "Processing..." : "Login"}
              </button>

              <Link
                href="/signup"
                className="block text-blue-600 text-xs text-center md:text-sm hover:underline"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Forgot Password Modal ─────────────────────────────────── */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            {!forgotSent ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  Reset Password
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Enter your email and we'll send you a reset link.
                </p>

                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="mt-1 mb-4 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
                />

                <button
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95"
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>

                <button
                  onClick={closeForgotModal}
                  className="w-full mt-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Check your inbox!
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  We've sent a password reset link to{" "}
                  <strong>{forgotEmail}</strong>. The link expires in 1 hour.
                </p>
                <button
                  onClick={closeForgotModal}
                  className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default Login;
