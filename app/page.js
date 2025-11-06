import Image from 'next/image';

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen p-6'>
      <h1 className='text-3xl font-bold mb-4'>Bienvenue sur Nexul</h1>
      <p className='mb-4'>Scannez le QR Code ci-dessous pour découvrir notre site vitrine :</p>
      <Image
        src='/qr-projetnexul.png'
        width={200}
        height={200}
        alt='QR Code Nexul'
        className='border p-2 rounded-lg'
      />
      <p className='mt-4 text-sm text-gray-500'>Créé par AISSANI • Powered by Next.js & TailwindCSS</p>
    </main>
  );
}
