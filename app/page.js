"use client";

import Image from "next/image";

export default function Home() {
  return (
    <main style={{ textAlign: "center", padding: "20px" }}>
      <h1>Bienvenue sur Nexul ??</h1>
      <p>Scannez ce QR Code pour accéder au site sur mobile :</p>

      <Image
        src="/qr-projetnexul.png"
        width={250}
        height={250}
        alt="QR Code vers Nexul"
        priority
      />

      <br />
      <a
        href="https://projetnexul.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "blue", textDecoration: "underline" }}
      >
        Cliquez ici pour accéder directement au site
      </a>
    </main>
  );
}
