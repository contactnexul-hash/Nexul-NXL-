export default function Register() {
  return (
    <main className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Créer un compte</h1>
      <form className="flex flex-col max-w-sm mx-auto space-y-3">
        <input type="text" placeholder="Nom" className="p-2 border rounded" required />
        <input type="email" placeholder="Email" className="p-2 border rounded" required />
        <input type="password" placeholder="Mot de passe" className="p-2 border rounded" required />
        <button type="submit" className="bg-green-500 text-white py-2 rounded hover:bg-green-600">
          S'inscrire
        </button>
      </form>
    </main>
  );
}
