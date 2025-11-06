'use client';
import Image from 'next/image';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100'>
      <h1 className='text-4xl font-bold mb-6'>Bienvenue sur Nexul</h1>
      <p className='text-lg mb-4'>Scannez le QR Code ci-dessous pour accéder au site :</p>
      <Image
        src='/qr-projetnexul.png'
        alt='QR Code Nexul'
        width={300}
        height={300}
        className='rounded-lg shadow-lg'
      />
      <p className='mt-4 text-sm text-gray-500'>Créé par AISSANI • Powered by Next.js & TailwindCSS</p>
    </main>
  );
}

