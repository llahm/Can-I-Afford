"use client";
import { useState, useEffect } from "react";

export default function CustomLoader({ text = "Preparing your sanctuary...", minDisplayTime = 1000 }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-cream-100/80 backdrop-blur-sm flex flex-col items-center justify-center p-10 space-y-4 animate-fade-in">
      <div className="uiverse-bg shadow-sm">
        <span className="uiverse-loader" aria-label="Loading animation"></span>
      </div>
      <p className="text-sm font-medium text-cocoa-700 tracking-wide">{text}</p>
    </div>
  );
}