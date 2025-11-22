"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("App is already installed");
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Image src="/cyclone.png" width={32} height={32} alt="logo" priority unoptimized />
        <p className="font-semibold">Download the App!</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleDismiss}
          className="px-3 py-1 rounded bg-blue-700 hover:bg-blue-800 text-sm"
        >
          Later
        </button>
        <button
          onClick={handleInstall}
          className="px-3 py-1 rounded bg-white text-blue-600 hover:bg-blue-50 text-sm font-semibold"
        >
          Install
        </button>
      </div>
    </div>
  );
}

