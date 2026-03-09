import React from 'react';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';
import { AdminGuard } from '@/components/shared/AdminGuard';

export function AdminLayout({ children }) {
  return (
    <div className='flex h-screen w-full overflow-hidden bg-[#050b1a] font-sans selection:bg-primary/30 selection:text-white'>
      {/* Dynamic Background Elements */}
      <div className='fixed inset-0 z-0 pointer-events-none overflow-hidden'>
        {/* Animated Blobs */}
        <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse' />
        <div className='absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-indigo-500/10 blur-[100px] rounded-full animate-pulse delay-700' />
        <div className='absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-purple-500/5 blur-[120px] rounded-full animate-pulse delay-1000' />

        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Sidebar - Desktop Only */}
      <div className='hidden md:flex relative z-20'>
        <Sidebar />
      </div>

      {/* Main Viewport */}
      <div className='flex-1 flex flex-col overflow-hidden relative z-10'>
        <AdminHeader />

        <main className='flex-1 overflow-y-auto w-full custom-scrollbar'>
          {/* Page Content Wrapper */}
          <div className='max-w-[1600px] mx-auto p-6 md:p-10 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-1000'>
            <AdminGuard>{children}</AdminGuard>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1.5rem;
        }

        .glass-morphism {
          background: rgba(5, 11, 26, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        @keyframes pulse-subtle {
          0%,
          100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.05);
          }
        }
        .animate-pulse {
          animation: pulse-subtle 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
