import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const BRAND_DIR = path.resolve("industry/brand");

test("brand asset logo.svg exists and is valid vector asset", () => {
  const filePath = path.join(BRAND_DIR, "logo.svg");
  assert.ok(fs.existsSync(filePath), "industry/brand/logo.svg must exist");
  const stat = fs.statSync(filePath);
  assert.ok(stat.size > 1000, `logo.svg size (${stat.size}B) should be > 1KB`);

  const content = fs.readFileSync(filePath, "utf8");
  assert.ok(content.includes("<svg"), "logo.svg must contain valid SVG root");
  assert.ok(content.includes("viewBox=\"0 0 512 512\""), "logo.svg must specify 512x512 viewBox");
  assert.equal(content.includes("AIHOT"), false, "logo.svg must not mention AIHOT");
});

test("brand rasterized icons exist and have valid non-zero sizes", () => {
  const expectedIcons = [
    { name: "icon.png", minSize: 20000 },
    { name: "icon-192.png", minSize: 10000 },
    { name: "apple-icon.png", minSize: 10000 },
  ];

  for (const icon of expectedIcons) {
    const filePath = path.join(BRAND_DIR, icon.name);
    assert.ok(fs.existsSync(filePath), `${icon.name} must exist in industry/brand/`);
    const stat = fs.statSync(filePath);
    assert.ok(stat.size > icon.minSize, `${icon.name} size (${stat.size}B) must be > ${icon.minSize}B`);

    // Verify PNG magic header
    const buf = fs.readFileSync(filePath);
    assert.equal(buf[0], 0x89);
    assert.equal(buf[1], 0x50); // P
    assert.equal(buf[2], 0x4e); // N
    assert.equal(buf[3], 0x47); // G
  }
});

test("brand favicon.ico exists and has valid multi-image ICO structure", () => {
  const filePath = path.join(BRAND_DIR, "favicon.ico");
  assert.ok(fs.existsSync(filePath), "favicon.ico must exist in industry/brand/");
  const stat = fs.statSync(filePath);
  assert.ok(stat.size > 2000, `favicon.ico size (${stat.size}B) must be > 2KB`);

  // Verify ICO magic header: 00 00 01 00
  const buf = fs.readFileSync(filePath);
  assert.equal(buf[0], 0x00);
  assert.equal(buf[1], 0x00);
  assert.equal(buf[2], 0x01);
  assert.equal(buf[3], 0x00);
});
