import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import qr from 'qr-image';
import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';

const app = express();
const port = 3000;

// Middleware to serve static files
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());

// Route to handle QR code generation
app.post('/generate-qr', (req, res) => {
  const url = req.body.url;
  console.log('Received URL:', url);

  // Generate QR code
  const qrPng = qr.imageSync(url, { type: 'png' });
  const qrCodeBase64 = Buffer.from(qrPng).toString('base64');

  // Save QR code image
  fs.writeFileSync('public/qr_img.png', qrPng);

  // Save URL to text file
  fs.writeFileSync('public/URL.txt', url);

  // Send the QR code back to the client
  res.json({ qrCode: qrCodeBase64 });
});

// Serve the HTML file at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
