/**
 * "Magic bytes" (file signature) sniffing so we trust the actual bytes of
 * an uploaded file instead of its filename/extension or the browser-supplied
 * Content-Type header — both are trivial for an attacker to spoof.
 *
 * Per the spec, only real JPEG and PNG images are allowed for receipts.
 */
const SIGNATURES: { mime: "image/jpeg" | "image/png"; bytes: number[] }[] = [
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
];

export function detectImageMimeType(buffer: Buffer): "image/jpeg" | "image/png" | null {
  for (const signature of SIGNATURES) {
    if (signature.bytes.every((byte, index) => buffer[index] === byte)) {
      return signature.mime;
    }
  }
  return null;
}
