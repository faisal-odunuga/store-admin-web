import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className='flex flex-col items-center justify-center p-8 h-64 text-slate-500'>
      <Loader2 className='h-8 w-8 animate-spin text-primary mb-4' />
      <p className='text-sm font-medium'>{message}</p>
    </div>
  );
}
