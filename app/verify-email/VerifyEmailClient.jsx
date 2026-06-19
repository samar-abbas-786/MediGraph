"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const VerifyEmailClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        toast.error("Invalid verification link");
        setIsVerifying(false);
        return;
      }

      try {
        const res = await axios.post("/api/verify-email", {
          token,
        });

        if (res.status === 200) {
          setIsVerified(true);
          setIsVerifying(false);

          toast.success("Email verified successfully!");

          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } catch (error) {
        const msg =
          error?.response?.data?.message ||
          "Email verification failed. The link may have expired.";

        toast.error(msg);
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center">
        {isVerifying ? (
          <>
            <div className="mb-4">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Verifying Email...
            </h2>

            <p className="text-gray-600">
              Please wait while we verify your email address.
            </p>
          </>
        ) : isVerified ? (
          <>
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
              Email Verified!
            </h2>

            <p className="text-gray-600 mb-6">
              Your email has been verified successfully. You can now login to
              your account.
            </p>

            <button
              onClick={() => router.push("/login")}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
            >
              Go to Login
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <div className="inline-block p-3 bg-red-100 rounded-full">
                <svg
                  className="w-8 h-8 text-red-600"
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
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Verification Failed
            </h2>

            <p className="text-gray-600 mb-6">
              The verification link is invalid or has expired. Please try
              signing up again.
            </p>

            <button
              onClick={() => router.push("/signup")}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
            >
              Back to Sign Up
            </button>
          </>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default VerifyEmailClient;