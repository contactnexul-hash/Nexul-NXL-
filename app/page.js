"use client";

export default function Home() {
  return (
    <main style={{ textAlign: "center", padding: "20px" }}>
      <h1>Bienvenue sur Nexul 🚀</h1>
      <p>Accédez au tableau de bord :</p>

      <a
        href="/dashboard"
        style={{ color: "blue", textDecoration: "underline" }}
      >
        👉 Aller au tableau de bord
      </a>
    </main>
  );
}
