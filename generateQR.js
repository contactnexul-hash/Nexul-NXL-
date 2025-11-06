const QRCode = require('qrcode');

QRCode.toFile('public/qr-projetnexul.png', 'https://projetnexul.vercel.app', function (err) {
  if (err) throw err;
  console.log('✅ QR Code généré dans public/qr-projetnexul.png');
});
