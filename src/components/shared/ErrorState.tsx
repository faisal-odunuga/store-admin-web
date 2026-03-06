import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <div className='flex flex-col items-center justify-center p-8 h-64 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl my-4 border border-red-200 dark:border-red-900/30'>
      <AlertCircle className='h-10 w-10 mb-4 opacity-80' />
      <p className='text-sm font-medium text-red-800 dark:text-red-400 mb-4'>{message}</p>
      {onRetry && (
        <Button
          variant='outline'
          onClick={onRetry}
          className='text-red-600 border-red-200 hover:bg-red-100'
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
