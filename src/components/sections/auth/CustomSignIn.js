'use client';

import React, { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        toast.success('Access Granted', {
          description: 'Synchronizing neural interface...',
        });
        router.push('/');
      } else {
        console.log(result);
        toast.error('Verification Required', {
          description: 'Please complete additional security steps.',
        });
      }
    } catch (err) {
      toast.error('Access Denied', {
        description: err.errors?.[0]?.message || 'Invalid credentials provided.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-6 bg-[#050b1a] relative overflow-hidden font-sans'>
      {/* Background Ambience */}
      <div className='absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full animate-pulse' />
      <div className='absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full animate-pulse delay-1000' />

      <div className='w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
        {/* Logo / Header */}
        <div className='text-center mb-10 space-y-4'>
          <div className='inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-primary/10 border border-primary/20 mb-6 group hover:scale-110 transition-transform duration-500'>
            <ShieldCheck className='h-10 w-10 text-primary group-hover:animate-pulse' />
          </div>
          <h1 className='text-4xl font-black text-white tracking-tighter uppercase tabular-nums'>
            DealPort <span className='text-primary'>Admin</span>
          </h1>
          <p className='text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]'>
            Secure Logistics Meridian
          </p>
        </div>

        {/* Login Card */}
        <div className='glass-card p-10 space-y-8 relative group'>
          <div className='absolute inset-0 bg-primary/[0.02] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none' />

          <form onSubmit={handleSubmit} className='space-y-6 relative z-10'>
            <div className='space-y-2.5'>
              <Label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>
                Operator Email
              </Label>
              <div className='relative'>
                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500' />
                <Input
                  type='email'
                  placeholder='name@dealport.io'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='bg-white/[0.03] border-white/5 rounded-2xl pl-12 h-14 focus-visible:ring-primary/20 font-bold text-white'
                  required
                />
              </div>
            </div>

            <div className='space-y-2.5'>
              <div className='flex justify-between items-center px-1'>
                <Label className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
                  Security Key
                </Label>
                <button
                  type='button'
                  className='text-[9px] font-black text-primary uppercase tracking-tighter hover:text-primary/80'
                >
                  Forgot Key?
                </button>
              </div>
              <div className='relative'>
                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500' />
                <Input
                  type='password'
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='bg-white/[0.03] border-white/5 rounded-2xl pl-12 h-14 focus-visible:ring-primary/20 font-bold text-white'
                  required
                />
              </div>
            </div>

            <Button
              type='submit'
              disabled={loading}
              className='w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 group transition-all duration-300 active:scale-95'
            >
              {loading ? (
                <Loader2 className='h-5 w-5 animate-spin' />
              ) : (
                <span className='flex items-center gap-3'>
                  Initialize Authorization
                  <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Footer Info */}
        <div className='mt-10 flex items-center justify-between px-2 opacity-40'>
          <div className='flex items-center gap-2'>
            <div className='h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse' />
            <span className='text-[9px] font-black text-white uppercase tracking-tighter'>
              Encrypted Channel Active
            </span>
          </div>
          <p className='text-[9px] font-black text-slate-500 uppercase tracking-tighter'>
            v0.1.0-STABLE
          </p>
        </div>
      </div>

      {/* Decorative Floating Elements */}
      <div className='absolute top-1/4 right-[15%] w-1 h-1 bg-white/20 rounded-full animate-ping' />
      <div className='absolute bottom-1/4 left-[15%] w-1 h-1 bg-primary/20 rounded-full animate-pulse delay-700' />
      <div className='absolute top-1/2 left-10 opacity-10 flex flex-col gap-4'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='h-0.5 w-8 bg-white rounded-full' />
        ))}
      </div>
    </div>
  );
}
