"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-4">📊 Tableau de bord</h1>
      <p className="text-lg mb-6">Bienvenue sur le tableau de bord Nexul !</p>

      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        ⬅ Retour à l'accueil
      </Link>
    </main>
  );
}
