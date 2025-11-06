const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const url = 'https://projetnexul.vercel.app';

const outputPath = path.join(__dirname, 'public', 'qr-projetnexul.png');

QRCode.toFile(outputPath, url, {
  width: 300,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#ffffff',
  },
})
  .then(() => console.log('✅ QR Code généré dans /public/qr-projetnexul.png'))
  .catch((err) => console.error('❌ Erreur génération QR :', err));
