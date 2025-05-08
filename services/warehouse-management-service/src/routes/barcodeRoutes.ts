import express from 'express';
import { generateQRCode, generateBarcode } from '../utils/barcodeUtils';

const router = express.Router();

// Generate a QR code
router.post('/generate-qr', async (req, res) => {
  try {
    const { data } = req.body;
    const qrCode = await generateQRCode(data);
    res.status(200).json({ qrCode });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Generate a barcode
router.post('/generate-barcode', (req, res) => {
  try {
    const { data } = req.body;
    const barcode = generateBarcode(data);
    res.status(200).json({ barcode });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;