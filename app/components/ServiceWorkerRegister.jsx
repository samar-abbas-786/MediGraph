"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register(
            "/service-worker.js",
            {
              scope: "/",
            },
          );
          console.log("✅ Service Worker registered:", registration.scope);

          // Handle SW updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "activated") {
                console.log("✅ Service Worker updated");
                window.location.reload();
              }
            });
          });

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        } catch (error) {
          console.error("❌ Service Worker registration failed:", error);
        }
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", registerServiceWorker);
      } else {
        registerServiceWorker();
      }
    }
  }, []);

  return null;
}
