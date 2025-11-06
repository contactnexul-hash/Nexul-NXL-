'use client';
import Image from 'next/image';

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen p-6 bg-white'>
      <h1 className='text-4xl font-bold mb-4'>Bienvenue sur Nexul</h1>
      <p className='mb-6 text-lg'>
        Scannez ce QR Code pour accéder au site sur mobile :
      </p>
      <Image
        src='/qr-projetnexul.png'
        alt='QR Code Nexul'
        width={250}
        height={250}
      />
      <p className='text-sm text-gray-500 mt-6'>
        Créé par AISSANI • Powered by Next.js & TailwindCSS
      </p>
    </main>
  );
}

