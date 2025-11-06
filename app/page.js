'use client';
import Image from 'next/image';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-8 bg-white'>
      <h1 className='text-4xl font-bold mb-4'>Bienvenue sur Nexul</h1>
      <p className='mb-6 text-lg'>Scannez le QR Code ci-dessous pour accéder au site depuis votre téléphone :</p>
      
      <Image
        src='/qr-projetnexul.png'
        alt='QR Code Nexul'
        width={250}
        height={250}
        className='shadow-lg rounded-lg'
      />

      <p className='mt-6 text-sm text-gray-500'>
        Créé par AISSANI • Powered by Next.js & TailwindCSS
      </p>
    </main>
  );
}

