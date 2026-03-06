import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-slate-50'>
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary hover:bg-primary/90 text-sm font-bold',
            card: 'shadow-xl border-primary/5 rounded-2xl',
          },
        }}
      />
    </div>
  );
}
