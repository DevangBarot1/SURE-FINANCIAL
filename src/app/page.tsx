"use client";
import React, { useState, useRef } from 'react';
import Uploader from '../components/Uploader';

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [progressState, setProgressState] = useState<{ status: string; percent: number }>({ status: 'idle', percent: 0 });
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleResult = (r: any) => {
    setResult(r);
    setProgressState({ status: 'done', percent: 100 });
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
  };

  const handleProgress = (p: any) => {
    if (p === null) return setProgressState({ status: 'idle', percent: 0 });
    if (typeof p === 'object' && p !== null && 'percent' in p) {
      const percent = Number((p as any).percent) || 0;
      const status = (p as any).status || 'processing';
      return setProgressState({ status, percent });
    }
    const num = Number(p);
    if (!Number.isNaN(num)) setProgressState({ status: 'processing', percent: Math.max(0, Math.min(100, Math.round(num))) });
  };

  return (
    <div className="space-y-8">
      <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-extrabold mb-3">Extract fields from financial PDFs — fast</h1>
          <p className="text-slate-300 mb-6">Upload a credit card statement and PDFParser will extract issuer, card tail, billing cycle, due date and total balance automatically.</p>
          <a href="#upload" className="inline-block px-5 py-3 rounded-md font-semibold" style={{ background: 'var(--accent)', color: '#042027' }}>Get started</a>
        </div>
        <div>
          <div className="p-4 rounded-lg border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div id="upload"><Uploader onResult={handleResult} onProgress={handleProgress} /></div>
          </div>
        </div>
      </section>

      <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <h4 className="font-semibold" style={{ color: 'var(--accent)' }}>Fast</h4>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Optimized extraction pipeline for instant results.</p>
        </div>
        <div className="p-4 rounded-lg border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <h4 className="font-semibold" style={{ color: 'var(--accent)' }}>Private</h4>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Files are processed in-memory by default — no storage.</p>
        </div>
        <div className="p-4 rounded-lg border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <h4 className="font-semibold" style={{ color: 'var(--accent)' }}>Accurate</h4>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Pattern-based parsers tuned for major issuers.</p>
        </div>
      </section>

      <section id="results">
        <div className="p-4 rounded-lg border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <h3 className="font-semibold mb-2" style={{ color: 'var(--accent)' }}>Extraction Results</h3>
          {progressState.status === 'processing' ? (
            <div className="text-slate-300">Processing... {progressState.percent}%</div>
          ) : result ? (
            result.error ? (
              <div className="text-red-400">{String(result.error)}</div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Issuer', value: result.issuer },
                  { label: 'Card Last 4', value: result.card_last4 },
                  { label: 'Billing Cycle', value: result.billing_cycle },
                  { label: 'Payment Due', value: result.payment_due_date },
                  { label: 'Total Balance', value: result.total_balance }
                ].map((item: any, i: number) => (
                  <div key={i} className="p-3 rounded" style={{ background: 'var(--card-bg)' }}>
                    <div className="text-xs uppercase mb-1" style={{ color: 'var(--muted)' }}>{item.label}</div>
                    <div className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>{item.value ?? 'N.A.'}</div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-slate-400">No results yet. Upload a PDF to start.</div>
          )}
        </div>
      </section>

            <section id="settings" className="p-4 rounded-lg border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <h4 className="font-semibold" style={{ color: 'var(--accent)' }}>Why PDFPARSER</h4>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>FAST | RELIABLE</p>
      </section>
    </div>
  );
}
