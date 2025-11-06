"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6'>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='text-center'
      >
        <h1 className='text-4xl md:text-5xl font-extrabold mb-4'>
          Bienvenue sur <span className='text-blue-400'>Nexul</span>
        </h1>
        <p className='text-lg md:text-xl text-gray-300 mb-6'>
          Scannez le QR code pour accéder à notre site vitrine.
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        className='bg-white p-4 rounded-2xl shadow-xl'
      >
        <Image
          src='/qr-projetnexul.png'
          width={220}
          height={220}
          alt='QR Code Nexul'
          className='rounded-lg'
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className='mt-6 text-sm text-gray-400'
      >
        Créé par <span className='font-medium text-white'>AISSANI</span> • Powered by Next.js & TailwindCSS
      </motion.p>
    </main>
  );
}
