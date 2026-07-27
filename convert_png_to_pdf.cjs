const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const PDFS_DIR = path.join(__dirname, 'public', 'pdfs');

async function convertPngToPdf(filePath) {
  const fileBuf = fs.readFileSync(filePath);
  const isPng = fileBuf.toString('utf8', 0, 8).includes('PNG');
  if (!isPng) {
    console.log(`Skipping ${filePath} — already a PDF`);
    return;
  }

  console.log(`Converting PNG to PDF for ${filePath}...`);
  const pdfDoc = await PDFDocument.create();
  const pngImage = await pdfDoc.embedPng(fileBuf);

  const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: pngImage.width,
    height: pngImage.height,
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, pdfBytes);
  console.log(`✅ Converted ${filePath} (${Math.round(pdfBytes.length / 1024)} KB)`);
}

async function main() {
  const dirs = fs.readdirSync(PDFS_DIR);
  for (const d of dirs) {
    const pdfPath = path.join(PDFS_DIR, d, 'partitura.pdf');
    if (fs.existsSync(pdfPath)) {
      await convertPngToPdf(pdfPath);
    }
  }
}

main().catch(console.error);
