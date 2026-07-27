/**
 * DOWNLOAD ASSETS FROM GOOGLE DRIVE
 * Downloads all required PDFs and audio files for the Cor Medjugorje liturgy.
 * Handles Google Drive's large-file virus scan confirmation page.
 *
 * Run with: node download_assets.cjs
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname);
const PDFS_DIR = path.join(BASE_DIR, 'public', 'pdfs');
const AUDIO_DIR = path.join(BASE_DIR, 'public', 'audio');

// ─── ASSETS TO DOWNLOAD ──────────────────────────────────────────────────────
const assets = [
  // INTRARE: Ne-aduni pe toti cu iubire
  { songId: 'intrare-1', type: 'pdf',   voice: null,    driveId: '1FO2ciB-cF1nkqLMALHmIahbJSrofReiv' },
  { songId: 'intrare-1', type: 'audio', voice: 'sopran', driveId: '195zP_fqQJb7-3N-phzlm5FzAIgNJETfv' },
  { songId: 'intrare-1', type: 'audio', voice: 'alto',   driveId: '1AOtz-rl2UERTbCmjSuWQb11hQ-PVzWDJ' },
  { songId: 'intrare-1', type: 'audio', voice: 'tenor',  driveId: '1S9_oHfxtCMd3WYgtCLxeV6fQHhMbTkPm' },
  { songId: 'intrare-1', type: 'audio', voice: 'bas',    driveId: '1mwJrtk-2Z2wuzGF3x3JLoEOoRzNjfw9v' },
  // KYRIE: Kyrie Bunoza
  { songId: 'kyrie-1',   type: 'pdf',   voice: null,    driveId: '1usI-W38i55ceCIhZ30YUrhy_Me5o5mYY' },
  { songId: 'kyrie-1',   type: 'audio', voice: 'sopran', driveId: '1O9eEkZQhjSqq8FHsxVo3JBdJJ8fvzsK-' },
  { songId: 'kyrie-1',   type: 'audio', voice: 'alto',   driveId: '15C4dtQyZfHs8Co3jbPXmlcsAMYU02bg8' },
  { songId: 'kyrie-1',   type: 'audio', voice: 'tenor',  driveId: '18lfDjpsqvywh6NoWkLeEJCLT1LvnDT42' },
  { songId: 'kyrie-1',   type: 'audio', voice: 'bas',    driveId: '1J3-ICP2CXOXrX6nd8Fx5rB6KmNiwUwdO' },
  // GLORIA 1 (Agostino Ricotta / Arr. Damir Bunoza)
  { songId: 'gloria-1',  type: 'pdf',   voice: null,    driveId: '1TGgQAhc9dguDaU_XaO1rdquTCh7dKuLs' },
  { songId: 'gloria-1',  type: 'audio', voice: 'sopran', driveId: '1r-so8AAp1f-S6lrGC3e96Hsz1ZBK-Kui' },
  { songId: 'gloria-1',  type: 'audio', voice: 'alto',   driveId: '12ihRcAaOTVRPoTNVxrRChaDt6v52RvjF' },
  { songId: 'gloria-1',  type: 'audio', voice: 'tenor',  driveId: '13yrgk01Ci8ijfXP5PDBC8OdUaZrS9HEm' },
  { songId: 'gloria-1',  type: 'audio', voice: 'bas',    driveId: '1vslIyhn1YQbxphxzAcQFmgKWlV_gherI' },
  // PSALM
  { songId: 'psalm-1',   type: 'pdf',   voice: null,    driveId: '1MZjtsbOgUtzqekB7vBOxhM4FsAl2aB23' },
  { songId: 'psalm-1',   type: 'audio', voice: 'sopran', driveId: '1VT9U0QdNvCDnwRgMmKUiiAJrQTsbxWc5' },
  { songId: 'psalm-1',   type: 'audio', voice: 'alto',   driveId: '1X9vqNdry68m7U6wcLR9UJ_6mRO9syLMh' },
  { songId: 'psalm-1',   type: 'audio', voice: 'tenor',  driveId: '1m-8u0qJaucy-TnwZuPRDnfajWWa53HLL' },
  { songId: 'psalm-1',   type: 'audio', voice: 'bas',    driveId: '11oZXNMZGEo-AglxXVlV53x_AoACdT2aL' },
  // OFERTORU: Cristos e lumina
  { songId: 'ofertoru-1', type: 'pdf',  voice: null,    driveId: '1i8CvsaePx3NkMxLZ_tIBimJUtsV_s72M' },
  { songId: 'ofertoru-1', type: 'audio', voice: 'sopran', driveId: '1rsWkYQcc4YDhz37U827QisIgNDXFT84k' },
  { songId: 'ofertoru-1', type: 'audio', voice: 'alto',   driveId: '1JtFw1VjRfBp1GnaRPhiK2ulagC63UIOF' },
  { songId: 'ofertoru-1', type: 'audio', voice: 'tenor',  driveId: '1szmKdyQHaaTuZKNge_BtPv467JxIJ7u6' },
  { songId: 'ofertoru-1', type: 'audio', voice: 'bas',    driveId: '1hczzDcxlc7aImcjcbUiTsDGyTXPBWhEJ' },
  // SANCTUS
  { songId: 'sanctus-1',  type: 'pdf',  voice: null,    driveId: '1AabkUeVQAoB1ZxXzlmEpULxL_wk5g7ul' },
  { songId: 'sanctus-1',  type: 'audio', voice: 'sopran', driveId: '1fSft4M4U7xg3FFRkA-sbNLnU5HjjbzFV' },
  { songId: 'sanctus-1',  type: 'audio', voice: 'alto',   driveId: '1Ldjoc3-NES9pbPRa1XiSN6gqud5hh_VR' },
  { songId: 'sanctus-1',  type: 'audio', voice: 'tenor',  driveId: '1Umy63qu4t1rNTSkwAsob_1KYTHMwswrL' },
  { songId: 'sanctus-1',  type: 'audio', voice: 'bas',    driveId: '1VZQYOpavqomPmfQC4y-_tkPlX2jTSqyP' },
  // COMMUNIO 1: Toti suntem una
  { songId: 'impartasanie-1', type: 'pdf',   voice: null,    driveId: '1OcnCKcisuaJnOkkXVrmt9Fj0Pbw1y4V1' },
  { songId: 'impartasanie-1', type: 'audio', voice: 'sopran', driveId: '1tUzJ8yCCiYsXnQ-8E4Yk1Qfp-ZREN5IO' },
  { songId: 'impartasanie-1', type: 'audio', voice: 'alto',   driveId: '11uCEtsqHlw9are1duaR367kaMF1CgK_2' },
  { songId: 'impartasanie-1', type: 'audio', voice: 'tenor',  driveId: '1x_J2WMnmy8MNVela2HOEXJj-w9cIjPlf' },
  { songId: 'impartasanie-1', type: 'audio', voice: 'bas',    driveId: '1bWHOKHTs_UqHN667aoMvjDSZtxWX650m' },
  // COMMUNIO 2: Jesus Christ you are my life
  { songId: 'impartasanie-2', type: 'pdf',   voice: null,    driveId: '1vTl3pF8qlp7V2fllf2r4S9n5wwdkUyLU' },
  { songId: 'impartasanie-2', type: 'audio', voice: 'sopran', driveId: '157yQ-2KIPHP_U6soxbu9bzj0AnLorCqy' },
  { songId: 'impartasanie-2', type: 'audio', voice: 'alto',   driveId: '1haOjoT5egDLGwYghcDUiprBMzUjU9X_S' },
  { songId: 'impartasanie-2', type: 'audio', voice: 'tenor',  driveId: '1YEI6F19f25kNIKPIR2rub3XrIwHTGV_I' },
  { songId: 'impartasanie-2', type: 'audio', voice: 'bas',    driveId: '1c9JniaW7e9wsqRq9DlYs8twCBKAdc0C5' },
];

// ─── HTTP GET HELPER ─────────────────────────────────────────────────────────
function getUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,*/*',
        ...options.headers,
      },
      ...options,
    }, (res) => {
      resolve(res);
    });
    req.on('error', reject);
  });
}

function collectBody(res) {
  return new Promise((resolve) => {
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

// ─── DOWNLOAD A SINGLE FILE ──────────────────────────────────────────────────
async function downloadDriveFile(driveId, destPath) {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000) {
    return 'exists';
  }

  const initialUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
  
  // Step 1: Hit the initial URL
  let res = await getUrl(initialUrl);
  let cookies = (res.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');

  // Follow 301/302 if any
  let location = res.headers.location;
  while ((res.statusCode === 301 || res.statusCode === 302) && location) {
    res = await getUrl(location, { headers: { Cookie: cookies } });
    const newCookies = (res.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');
    if (newCookies) cookies = [cookies, newCookies].filter(Boolean).join('; ');
    location = res.headers.location;
  }

  // Step 2: If we get a 303, it's the virus-scan confirmation page
  // We need to read the page body and find the download token
  if (res.statusCode === 303) {
    location = res.headers.location;
    if (!location) throw new Error('Got 303 but no Location header');
    // The Location after 303 is the actual download URL with confirm token
    return await streamToFile(location, cookies, destPath);
  }

  // If content-type is HTML, we have the confirmation page inline
  const contentType = res.headers['content-type'] || '';
  if (contentType.includes('text/html')) {
    const body = await collectBody(res);
    // Look for the confirm link in the HTML
    const confirmMatch = body.match(/href="(\/uc\?export=download[^"]+confirm=[^"]+)"/);
    if (confirmMatch) {
      const confirmUrl = 'https://drive.google.com' + confirmMatch[1].replace(/&amp;/g, '&');
      return await streamToFile(confirmUrl, cookies, destPath);
    }
    // Look for the download-form action
    const formMatch = body.match(/action="([^"]+)"/);
    if (formMatch) {
      const tokenMatch = body.match(/name="uuid" value="([^"]+)"/);
      const uuid = tokenMatch ? tokenMatch[1] : '';
      const formUrl = formMatch[1].replace(/&amp;/g, '&');
      return await streamToFile(formUrl + (uuid ? `&uuid=${uuid}` : ''), cookies, destPath);
    }
    throw new Error(`Got HTML confirmation page but could not parse download link. ID: ${driveId}`);
  }

  // Otherwise directly pipe the response
  return await pipeResToFile(res, destPath);
}

async function streamToFile(url, cookies, destPath) {
  let res = await getUrl(url, {
    headers: {
      Cookie: cookies,
      Referer: 'https://drive.google.com/',
    }
  });

  // Follow redirects
  let location = res.headers.location;
  let hops = 0;
  while ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) && location && hops < 6) {
    const newCookies = (res.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');
    if (newCookies) cookies = [cookies, newCookies].filter(Boolean).join('; ');
    res = await getUrl(location, { headers: { Cookie: cookies } });
    location = res.headers.location;
    hops++;
  }

  return await pipeResToFile(res, destPath);
}

function pipeResToFile(res, destPath) {
  return new Promise((resolve, reject) => {
    if (res.statusCode !== 200) {
      collectBody(res).then(body => {
        reject(new Error(`HTTP ${res.statusCode}. Body: ${body.slice(0, 200)}`));
      });
      return;
    }
    const file = fs.createWriteStream(destPath);
    res.pipe(file);
    file.on('finish', () => {
      file.close(() => {
        const size = fs.existsSync(destPath) ? fs.statSync(destPath).size : 0;
        if (size < 2000) {
          fs.unlinkSync(destPath);
          reject(new Error(`File too small (${size}B) — Drive blocked download`));
        } else {
          resolve('downloaded');
        }
      });
    });
    file.on('error', (err) => {
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🎵 Cor Medjugorje — Asset Downloader\n');
  let ok = 0, skipped = 0, fail = 0;
  const failures = [];

  for (const asset of assets) {
    let dir, filename;
    if (asset.type === 'pdf') {
      dir = path.join(PDFS_DIR, asset.songId);
      filename = 'partitura.pdf';
    } else {
      dir = path.join(AUDIO_DIR, asset.songId);
      filename = `${asset.voice}.mp3`;
    }

    fs.mkdirSync(dir, { recursive: true });
    const destPath = path.join(dir, filename);
    process.stdout.write(`  ⬇  ${asset.songId}/${filename} ... `);

    try {
      const result = await downloadDriveFile(asset.driveId, destPath);
      if (result === 'exists') {
        console.log(`⏭  (cached)`);
        skipped++;
      } else {
        const size = fs.statSync(destPath).size;
        console.log(`✅ (${Math.round(size / 1024)}KB)`);
        ok++;
      }
    } catch (err) {
      console.log(`❌ ${err.message.slice(0, 120)}`);
      fail++;
      failures.push({ asset, error: err.message });
    }

    // Small delay to avoid hammering Drive
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n✅ Downloaded: ${ok}, ⏭  Cached: ${skipped}, ❌ Failed: ${fail}`);
  if (failures.length) {
    console.log('\nFailed assets (copy these manually):');
    failures.forEach(({ asset }) => {
      const label = asset.voice ? `${asset.voice}.mp3` : 'partitura.pdf';
      console.log(`  ${asset.songId}/${label}  →  https://drive.google.com/file/d/${asset.driveId}/view`);
    });
  }
}

main().catch(console.error);
