"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/login", { email, password });
      if (res.status == 200) {
        console.log("res", res);
        toast.success(res.data.message);
        setTimeout(() => {
          router.push("/home");
        }, 1000);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Something went wrong. Try again!";
      toast.error(msg);
    }
  };

  return (
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
              <label className="text-sm font-medium text-gray-700">Email</label>
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
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95"
            >
              Login
            </button>

            <a
              href="/signup"
              className="text-blue-600 text-xs text-center md:text-sm hover:underline"
            >
              Create account
            </a>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>Test Credentials:</p>
            <p>
              Email: <b>samar@gmail.com</b>
            </p>
            <p>
              Password: <b>samar@123</b>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
