"use client";

export default function Home() {
  return (
    <main style={{ textAlign: "center", padding: "20px" }}>
      <h1>Bienvenue sur Nexul 🚀</h1>
      <p>Accédez au site directement en cliquant ci-dessous :</p>
      <a
        href="https://projetnexul.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "blue", textDecoration: "underline" }}
      >
        👉 Cliquez ici pour accéder au site
      </a>
    </main>
  );
}
