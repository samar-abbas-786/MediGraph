"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    let intervalId;

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          "/service-worker.js",
          {
            scope: "/",
          },
        );

        console.log("✅ Service Worker registered:", registration.scope);

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;

          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "activated") {
              console.log("✅ Service Worker updated");
              window.location.reload();
            }
          });
        });

        intervalId = setInterval(() => {
          registration.update();
        }, 60000);
      } catch (error) {
        console.error("❌ Service Worker registration failed:", error);
      }
    };

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      registerServiceWorker();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return null;
}
