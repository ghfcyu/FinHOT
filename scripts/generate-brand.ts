import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const BRAND_DIR = path.resolve("industry/brand");

export const FINHOT_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0D1626"/>
      <stop offset="100%" stop-color="#060A12"/>
    </linearGradient>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2CE2E8"/>
      <stop offset="50%" stop-color="#00C4D4"/>
      <stop offset="100%" stop-color="#008BA3"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <linearGradient id="surgeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#0E7490" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#2CE2E8" stop-opacity="0.9"/>
    </linearGradient>
    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Base Icon Canvas with rounded squircle -->
  <rect width="512" height="512" rx="116" fill="url(#bgGrad)"/>
  <rect x="12" y="12" width="488" height="488" rx="104" fill="none" stroke="#1E293B" stroke-width="3" stroke-opacity="0.6"/>

  <!-- Background Market Pulse Wave (Subtle grid/trend lines) -->
  <path d="M72 384 L144 384 L220 330 L300 350 L380 240 L440 240" fill="none" stroke="#1E293B" stroke-width="4" stroke-dasharray="8 8" stroke-opacity="0.5"/>

  <!-- Ascending Volume Pillars (Capital Flow) -->
  <rect x="236" y="324" width="40" height="72" rx="10" fill="url(#surgeGrad)"/>
  <rect x="300" y="248" width="40" height="148" rx="10" fill="url(#surgeGrad)"/>
  <rect x="364" y="172" width="40" height="224" rx="10" fill="url(#goldGrad)" opacity="0.95"/>

  <!-- FinHOT Core Monogram "F" (Financial Architecture) -->
  <!-- Vertical Pillar -->
  <rect x="108" y="114" width="56" height="282" rx="14" fill="url(#primaryGrad)"/>

  <!-- Top Horizontal Bar with Dynamic Trend Terminal -->
  <path d="M108 128 C108 120 114 114 122 114 L340 114 C352 114 360 126 354 136 L332 172 C328 178 322 182 314 182 L122 182 C114 182 108 176 108 168 Z" fill="url(#primaryGrad)"/>

  <!-- Middle Crossbar with Market Momentum -->
  <path d="M108 232 C108 226 114 220 122 220 L276 220 C286 220 292 230 288 238 L272 268 C268 274 262 278 254 278 L122 278 C114 278 108 272 108 266 Z" fill="url(#primaryGrad)"/>

  <!-- Dynamic Bull Market Trend Crest (Arrow / Peak) -->
  <path d="M344 114 L420 114 C426 114 430 118 430 124 L430 200 L394 164 L336 222 L310 196 L368 138 Z" fill="url(#goldGrad)" filter="url(#subtleGlow)"/>

  <!-- Hot Capital Spark (Glowing Diamond Beacon at Trend Peak) -->
  <polygon points="430,94 442,106 430,118 418,106" fill="#FDE68A"/>
</svg>
`;

/**
 * Packs multiple PNG buffers into standard Windows ICO format.
 */
function packIco(images: Array<{ width: number; height: number; buffer: Buffer }>): Buffer {
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4);

  const dirEntries: Buffer[] = [];
  const buffers: Buffer[] = [];

  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // image size
    entry.writeUInt32LE(offset, 12); // image offset

    dirEntries.push(entry);
    buffers.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...buffers]);
}

async function generateBrandAssets() {
  const svgBuf = Buffer.from(FINHOT_LOGO_SVG.trim());

  // 1. Write logo.svg
  await fs.writeFile(path.join(BRAND_DIR, "logo.svg"), FINHOT_LOGO_SVG.trim() + "\n", "utf8");
  console.log("Updated industry/brand/logo.svg");

  // 2. Generate icon.png (512x512)
  const icon512 = await sharp(svgBuf).resize(512, 512).png().toBuffer();
  await fs.writeFile(path.join(BRAND_DIR, "icon.png"), icon512);
  console.log("Generated industry/brand/icon.png (512x512)");

  // 3. Generate icon-192.png (192x192)
  const icon192 = await sharp(svgBuf).resize(192, 192).png().toBuffer();
  await fs.writeFile(path.join(BRAND_DIR, "icon-192.png"), icon192);
  console.log("Generated industry/brand/icon-192.png (192x192)");

  // 4. Generate apple-icon.png (180x180)
  const icon180 = await sharp(svgBuf).resize(180, 180).png().toBuffer();
  await fs.writeFile(path.join(BRAND_DIR, "apple-icon.png"), icon180);
  console.log("Generated industry/brand/apple-icon.png (180x180)");

  // 5. Generate favicon.ico (16x16, 32x32, 48x48)
  const ico16 = await sharp(svgBuf).resize(16, 16).png().toBuffer();
  const ico32 = await sharp(svgBuf).resize(32, 32).png().toBuffer();
  const ico48 = await sharp(svgBuf).resize(48, 48).png().toBuffer();
  const icoBuf = packIco([
    { width: 16, height: 16, buffer: ico16 },
    { width: 32, height: 32, buffer: ico32 },
    { width: 48, height: 48, buffer: ico48 },
  ]);
  await fs.writeFile(path.join(BRAND_DIR, "favicon.ico"), icoBuf);
  console.log("Generated industry/brand/favicon.ico (16, 32, 48)");

  console.log("All brand assets generated successfully!");
}

generateBrandAssets().catch((err) => {
  console.error(err);
  process.exit(1);
});
