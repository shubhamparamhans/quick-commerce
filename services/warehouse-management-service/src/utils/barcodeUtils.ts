import QRCode from 'qrcode';
import { createCanvas } from 'canvas';

// Generate a QR code
export const generateQRCode = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data);
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};

// Generate a barcode
export const generateBarcode = (data: string): string => {
  const canvas = createCanvas(200, 100);
  const context = canvas.getContext('2d');

  context.font = '20px Arial';
  context.fillText(data, 10, 50);

  return canvas.toDataURL();
};