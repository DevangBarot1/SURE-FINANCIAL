import React from 'react';

export default function Header() {
  return (
    <header className="w-full py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md flex items-center justify-center font-bold" style={{ background: 'linear-gradient(90deg, rgba(20,184,166,1), rgba(16,185,129,0.9))' }}>
            D
          </div>
          <div>
            <div className="text-white font-semibold">PDFParser</div>
            <div className="text-xs text-slate-400">PDF parsing</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-slate-300">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#upload" className="hover:text-white">Upload</a>
        </nav>
      </div>
    </header>
  );
}
