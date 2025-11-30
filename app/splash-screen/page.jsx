import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Splash_Screen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/home");
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative">
      <div className="bg-black absolute w-full h-[100vh] opacity-40"></div>

      <img
        className="w-full h-[100vh] object-cover"
        src="/splash.jpg"
        alt="Splash"
      />

      <div className="absolute z-50 top-0 left-0 w-full h-full flex items-center justify-center">
        <h1 className="text-4xl font-bold text-center">Welcome to MediGraph</h1>
      </div>
    </div>
  );
};

export default Splash_Screen;
