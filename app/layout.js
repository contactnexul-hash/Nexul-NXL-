import "./globals.css";

export const metadata = {
  title: "Nexul",
  description: "Plateforme Nexul",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-white text-black dark:bg-gray-900 dark:text-white transition">
        <nav className="p-4 bg-gray-200 dark:bg-gray-800 flex justify-between">
          <a href="/" className="font-bold">🏠 Accueil</a>
          <div className="space-x-4">
            <a href="/dashboard">📊 Dashboard</a>
            <a href="/login">🔑 Login</a>
            <a href="/register">📝 Register</a>
          </div>
          <button 
            onClick={() => document.documentElement.classList.toggle('dark')} 
            className="px-4 py-1 bg-gray-300 dark:bg-gray-700 rounded"
          >
            🌙 Mode
          </button>
        </nav>
        {children}
      </body>
    </html>
  );
}
