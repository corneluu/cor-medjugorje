/**
 * Converts the two most recently modified PNG files from temp media storage
 * into PDFs at:
 *   public/pdfs/alleluia-1/partitura.pdf
 *   public/pdfs/incheiere-1/partitura.pdf
 *
 * The FIRST file (hallelujah score, by timestamp asc) → alleluia-1
 * The SECOND file (maria lyrics) → incheiere-1
 *
 * Run: node make_score_pdfs.cjs
 */

const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const MEDIA_DIR = 'C:\\Users\\maiao\\.gemini\\antigravity\\brain\\64e5f8c1-0675-4fcc-ba6e-bdae9b8ba3f8\\.tempmediaStorage';
const PDFS_DIR = path.join(__dirname, 'public', 'pdfs');

async function pngToPdf(pngPath, outPath) {
  const pngBuf = fs.readFileSync(pngPath);
  const pdfDoc = await PDFDocument.create();
  const img = await pdfDoc.embedPng(pngBuf);
  // A4-ish page scaled to fit the image
  const scale = Math.min(595 / img.width, 842 / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const page = pdfDoc.addPage([w, h]);
  page.drawImage(img, { x: 0, y: 0, width: w, height: h });
  const bytes = await pdfDoc.save();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, bytes);
  console.log(`✅ Written ${outPath} (${Math.round(bytes.length / 1024)} KB)`);
}

async function main() {
  // Find all media_*.png files sorted by name (which encodes timestamp)
  const files = fs.readdirSync(MEDIA_DIR)
    .filter(f => f.startsWith('media_') && f.endsWith('.png'))
    .map(f => ({
      name: f,
      fullPath: path.join(MEDIA_DIR, f),
      size: fs.statSync(path.join(MEDIA_DIR, f)).size,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // The two images from the most recent user message — pick the last 2
  const last2 = files.slice(-2);
  console.log('Using images:');
  last2.forEach(f => console.log(`  ${f.name}  (${Math.round(f.size/1024)} KB)`));

  if (last2.length < 2) {
    console.error('Could not find 2 PNG images in temp storage');
    process.exit(1);
  }

  // First image in message = Halelluya (alleluia-1), second = Maria (incheiere-1)
  await pngToPdf(last2[0].fullPath, path.join(PDFS_DIR, 'alleluia-1', 'partitura.pdf'));
  await pngToPdf(last2[1].fullPath, path.join(PDFS_DIR, 'incheiere-1', 'partitura.pdf'));

  console.log('\nDone! Both PDFs created.');
}

main().catch(console.error);
