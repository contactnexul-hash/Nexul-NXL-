"use client";
import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const NexulVitrine = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Bienvenue sur Nexul
      </h1>
      <p className="text-lg mb-4 text-center max-w-md">
        Scannez le QR code ci-dessous pour découvrir notre site vitrine.
      </p>
      <QRCodeCanvas value="https://projetnexul.vercel.app" size={180} />
      <p className="mt-6 text-sm text-gray-400">
        Créé par AISSANI • Powered by Next.js & TailwindCSS
      </p>
    </div>
  );
};

export default NexulVitrine;
