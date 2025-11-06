"use client";

export default function Home() {
  return (
    <main style={{ textAlign: "center", padding: "20px" }}>
      <h1>Bienvenue sur Nexul 🚀</h1>
      <p>Accédez directement au site :</p>
      <a
        href="https://projetnexul.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        style={{ 
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
          marginTop: "10px"
        }}
      >
        👉 Entrer sur le site Nexul
      </a>
    </main>
  );
}
