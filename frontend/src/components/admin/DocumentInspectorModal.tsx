"use client";

import { useState } from "react";

interface Props {
  imageUrl: string;
  open: boolean;
  onClose: () => void;
}

// The spec's "document inspector": zoom, rotate, and invert-colors so a
// moderator can actually read a blurry or low-contrast receipt photo.
export default function DocumentInspectorModal({ imageUrl, open, onClose }: Props) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [inverted, setInverted] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-6" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-paper-line p-4">
          <p className="font-bold text-ink">فحص إيصال الدفع</p>
          <button onClick={onClose} className="text-muted hover:text-danger">
            إغلاق ✕
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-paper-dim p-6">
          <div className="flex min-h-full items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="إيصال الدفع"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                filter: inverted ? "invert(1)" : "none",
                transition: "transform 0.15s ease",
              }}
              className="max-h-[60vh] rounded-lg shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-paper-line p-4">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
            className="rounded-full border border-paper-line px-4 py-2 text-sm font-bold hover:border-orange hover:text-orange"
          >
            تقريب +
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
            className="rounded-full border border-paper-line px-4 py-2 text-sm font-bold hover:border-orange hover:text-orange"
          >
            تبعيد -
          </button>
          <button
            onClick={() => setRotation((r) => r + 90)}
            className="rounded-full border border-paper-line px-4 py-2 text-sm font-bold hover:border-orange hover:text-orange"
          >
            تدوير
          </button>
          <button
            onClick={() => setInverted((v) => !v)}
            className={`rounded-full border px-4 py-2 text-sm font-bold ${
              inverted ? "border-orange bg-orange-soft text-orange" : "border-paper-line hover:border-orange hover:text-orange"
            }`}
          >
            عكس الألوان
          </button>
        </div>
      </div>
    </div>
  );
}
