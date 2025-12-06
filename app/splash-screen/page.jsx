"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Splash_Screen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/home");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-600 to-blue-400 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Floating Blobs */}
      <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      {/* Logo Circle */}
      <div className="w-32 h-32 bg-white/20 rounded-full backdrop-blur-xl flex items-center justify-center shadow-2xl animate-bounce">
        <span className="text-white text-5xl font-extrabold">M</span>
      </div>

      {/* App Name */}
      <h1 className="text-4xl font-bold text-white mt-6 animate-fadeIn">
        MediGraph
      </h1>

      {/* Tagline */}
      <p className="text-white/90 mt-2 text-lg animate-fadeInSlow">
        Smarter Preventive Healthcare
      </p>

      {/* Bottom Loader Bar */}
      <div className="absolute bottom-20 w-40 h-2 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full w-full bg-white animate-loadingBar"></div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
        @keyframes fadeInSlow {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInSlow {
          animation: fadeInSlow 1.6s ease forwards;
        }
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loadingBar {
          animation: loadingBar 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Splash_Screen;
