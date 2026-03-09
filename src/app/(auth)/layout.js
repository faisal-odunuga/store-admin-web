'use client';

import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-[#050b1a] relative overflow-hidden font-sans'>
      {/* Cinematic Background Elements */}
      <div className='fixed inset-0 z-0 pointer-events-none'>
        <div className='absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[150px] rounded-full animate-pulse' />
        <div className='absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[130px] rounded-full animate-pulse delay-700' />
        <div className='absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-purple-500/5 blur-[140px] rounded-full animate-pulse delay-1000' />

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] mix-blend-overlay" />
      </div>

      <div className='relative z-10 w-full max-w-[480px] p-6 md:p-10 animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-8'>
        <div className='mb-12 text-center space-y-3'>
          <div className='bg-primary h-16 w-16 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-primary/40 mx-auto mb-6 group hover:scale-110 transition-transform duration-500'>
            <svg
              className='h-8 w-8 text-white'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M13 2L3 14h9l-1 8 10-12h-9l1-8z' />
            </svg>
          </div>
          <h1 className='text-4xl font-black text-white tracking-tighter uppercase'>DEALPORT</h1>
          <p className='text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]'>
            Administrative Access Node
          </p>
        </div>

        <div className='glass-card border-white/10 p-2 shadow-2xl shadow-black/40'>{children}</div>

        <div className='mt-10 text-center'>
          <p className='text-[9px] font-bold text-slate-600 uppercase tracking-widest'>
            &copy; 2026 Dealport Enterprise • Neural Encryption Active
          </p>
        </div>
      </div>

      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 2.5rem;
        }

        /* Clerk Custom Overrides */
        .cl-rootBox {
          width: 100%;
        }
        .cl-card {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
        }
        .cl-headerTitle {
          color: white !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: -0.025em !important;
        }
        .cl-headerSubtitle {
          color: #94a3b8 !important;
        }
        .cl-socialButtonsBlockButton {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          color: white !important;
        }
        .cl-socialButtonsBlockButton:hover {
          background: rgba(255, 255, 255, 0.07) !important;
        }
        .cl-dividerLine {
          background: rgba(255, 255, 255, 0.05) !important;
        }
        .cl-dividerText {
          color: #64748b !important;
        }
        .cl-formLabel {
          color: #94a3b8 !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          font-size: 10px !important;
          letter-spacing: 0.05em !important;
        }
        .cl-formFieldInput {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          color: white !important;
          border-radius: 1rem !important;
        }
        .cl-formButtonPrimary {
          background: #3b82f6 !important;
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3) !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          border-radius: 1rem !important;
        }
        .cl-footerActionLink {
          color: #3b82f6 !important;
          font-weight: 900 !important;
        }
      `}</style>
    </div>
  );
}
