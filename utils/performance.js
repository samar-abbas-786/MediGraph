/**
 * Performance optimization utilities for MediGraph
 */

// Debounce function to prevent excessive function calls
export const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function to limit function execution frequency
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Lazy load images with IntersectionObserver
export const lazyLoadImages = () => {
  if (typeof window !== "undefined" && "IntersectionObserver" in window) {
    const imageElements = document.querySelectorAll("img[data-lazy]");
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.lazy;
          img.removeAttribute("data-lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    imageElements.forEach((img) => imageObserver.observe(img));
  }
};

// Preload resources for faster page loads
export const preloadResource = (url, type = "script") => {
  if (typeof document !== "undefined") {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = url;
    link.as = type;
    document.head.appendChild(link);
  }
};

// Prefetch resources for better navigation performance
export const prefetchResource = (url) => {
  if (typeof document !== "undefined") {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    document.head.appendChild(link);
  }
};

// Batch DOM updates to avoid layout thrashing
export const batchDOMUpdates = (updates) => {
  requestAnimationFrame(() => {
    updates.forEach((update) => update());
  });
};

// Monitor performance metrics
export const measurePerformance = (label) => {
  if (typeof window !== "undefined" && "performance" in window) {
    return {
      start: () => performance.mark(`${label}-start`),
      end: () => {
        performance.mark(`${label}-end`);
        performance.measure(label, `${label}-start`, `${label}-end`);
        const measure = performance.getEntriesByName(label)[0];
        console.log(`${label}: ${measure.duration.toFixed(2)}ms`);
      },
    };
  }
  return { start: () => {}, end: () => {} };
};
