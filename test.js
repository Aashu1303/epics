const fs = require('fs');
const qrcode = require('qrcode');
const jsqr = require('jsqr');

// Generate QR Code
const generateQRCode = async (data, outputPath) => {
    try {
        await qrcode.toFile(outputPath, data);
        console.log('QR Code generated successfully');
    } catch (error) {
        console.error('Error generating QR Code:', error);
    }
};

// Scan QR Code
const scanQRCode = (qrCodeImagePath) => {
    try {
        // Read the QR code image as a buffer
        const qrCodeImageBuffer = fs.readFileSync(qrCodeImagePath);

        // Decode the QR code
        const qrCode = jsqr(qrCodeImageBuffer, qrCodeImageBuffer.length);

        if (qrCode) {
            // Parse the decoded data (assuming it's JSON)
            const decodedData = JSON.parse(qrCode.data);
            console.log('Decoded QR Code Data:', decodedData);
        } else {
            console.log('QR Code not decoded');
        }
    } catch (error) {
        console.error('Error scanning QR Code:', error);
    }
};

// Usage
const qrCodeData = '{"key": "value"}';
const qrCodePath = 'qrcode.png';

// Generate QR Code
generateQRCode(qrCodeData, qrCodePath);

// Simulate scanning the generated QR Code
scanQRCode(qrCodePath);
