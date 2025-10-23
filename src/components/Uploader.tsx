"use client";
import React, { useRef, useState } from 'react';

type UploaderProps = {
  onResult?: (r: any) => void;
  onProgress?: (p: { status: 'processing' | 'done' | 'error'; percent: number }) => void;
  light?: boolean;
};

export default function Uploader({ onResult, onProgress, light = false }: UploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setLoading(true);
    setProgress(0);
    try {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      onProgress && onProgress({ status: 'processing', percent: 0 });
      const data = await uploadWithProgress(file, (p) => {
        setProgress(p);
        onProgress && onProgress({ status: 'processing', percent: p });
      });
      onResult && onResult(data);
      onProgress && onProgress({ status: 'done', percent: 100 });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      onResult && onResult({ error: message });
      onProgress && onProgress({ status: 'error', percent: 0 });
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }

  function uploadWithProgress(file: File, onProgress: (p: number) => void) {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/parse');
      xhr.responseType = 'json';
      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
        else reject(new Error(xhr.response?.error || `Upload failed: ${xhr.status}`));
      };
      xhr.onerror = function () {
        reject(new Error('Network error'));
      };
      const form = new FormData();
      form.append('file', file);
      xhr.send(form);
    });
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (f) handleFile(f);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function useSample() {
    const sampleText = `DocuScan Sample Statement\n\nAccount: Sample Card Ending in 1234\nStatement Period: Sep 01, 2025 - Sep 30, 2025\nPayment Due Date: Oct 22, 2025\nNew Balance: $123.45\n`;
    try {
      const pdfLib = await import('pdf-lib');
      const { PDFDocument, StandardFonts } = pdfLib;
      const doc = await PDFDocument.create();
      const page = doc.addPage([600, 800]);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      page.drawText(sampleText, { x: 24, y: 760, size: fontSize, font });
  const uint8 = await doc.save();
  const blob = new Blob([new Uint8Array(uint8)], { type: 'application/pdf' });
      const file = new File([blob], 'docuscan-sample.pdf', { type: 'application/pdf' });
      await handleFile(file);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError('Sample generation failed: ' + message);
    }
  }

  const dashedClass = light ? 'border-dashed border-2 border-slate-200' : 'border-dashed border-2 border-slate-700';

  return (
    <div>
      {loading && (
        <div className="h-2 bg-slate-700 rounded overflow-hidden mb-3">
          <div className="h-full bg-cyan-400" style={{ width: progress != null ? `${progress}%` : '40%' }} />
        </div>
      )}

      <div onDrop={onDrop} onDragOver={(e) => e.preventDefault()} className={`p-4 rounded-lg flex justify-between items-center ${dashedClass} bg-gradient-to-b from-slate-900/20`}>
        <div>
          <strong className="text-white">Drop a PDF here</strong>
          <div className="text-sm text-slate-400">or click to choose a file</div>
        </div>

        <div className="flex gap-3 items-center">
          <input ref={inputRef} type="file" accept="application/pdf" onChange={onChange} className="hidden" />
          <button onClick={() => inputRef.current && inputRef.current.click()} className="px-3 py-2 rounded-md text-slate-900 font-semibold" style={{ background: 'var(--accent)' }}>{loading ? 'Parsing...' : 'Choose file'}</button>
          <button onClick={useSample} className="px-3 py-2 rounded-md bg-slate-100 text-slate-900" disabled={loading}>Use sample</button>
        </div>
      </div>

      {error && <div className="text-red-400 mt-2">{error}</div>}
    </div>
  );
}
