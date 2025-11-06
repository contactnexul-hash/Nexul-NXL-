"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Redirection automatique vers ton site en ligne
    window.location.href = "https://projetnexul.vercel.app";
  }, []);

  return (
    <main style={{ textAlign: "center", padding: "20px" }}>
      <h1>Redirection en cours...</h1>
      <p>Veuillez patienter, vous allez être redirigé vers Nexul.</p>
    </main>
  );
}
