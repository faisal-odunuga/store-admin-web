'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { usersService } from '@/lib/apiService';
import { UserPlus, Settings as SettingsIcon, ShieldCheck, Paintbrush } from 'lucide-react';
import { getErrorMessage } from '@/lib/errors';
import { useAuthMe } from '@/hooks/useAuthMe';

const createManagerSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type CreateManagerValues = z.infer<typeof createManagerSchema>;

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { data: me } = useAuthMe();
  const isAdmin = me?.role === 'ADMIN';

  const form = useForm<CreateManagerValues>({
    resolver: zodResolver(createManagerSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    },
  });

  const onSubmit = async (values: CreateManagerValues) => {
    setIsSubmitting(true);
    try {
      await usersService.createManager(values);
      toast.success('Manager account created successfully!');
      form.reset();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to create manager'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer
      title='Settings'
      description='Configure your store preferences and manage administrative access.'
    >
      {!isAdmin && (
        <div className='mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700'>
          Only the admin can manage administrators and sensitive settings.
        </div>
      )}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column: Navigation/Categories */}
        <div className='lg:col-span-1 space-y-4'>
          <Card className='shadow-sm border-slate-100'>
            <CardHeader className='p-4'>
              <CardTitle className='text-sm font-bold flex items-center gap-2'>
                <SettingsIcon size={16} className='text-primary' /> General
              </CardTitle>
            </CardHeader>
            <CardContent className='p-2 pt-0'>
              <nav className='space-y-1'>
                <button className='w-full flex items-center gap-3 px-3 py-2 text-sm font-medium bg-primary/10 text-primary rounded-lg'>
                  <ShieldCheck size={16} /> Admin Management
                </button>
                <button className='w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors'>
                  <Paintbrush size={16} /> Appearance
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Content */}
        <div className='lg:col-span-2 space-y-8'>
          <Card className={`shadow-md border-slate-100 ${!isAdmin ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className='flex items-center gap-2 mb-1'>
                <UserPlus size={18} className='text-primary' />
                <CardTitle>Create New Manager</CardTitle>
              </div>
              <CardDescription>
                Add a new manager to help run daily operations. They will be required to complete
                their setup upon first login.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='firstName'>First Name</Label>
                    <Input
                      id='firstName'
                      placeholder='John'
                      {...form.register('firstName')}
                      disabled={!isAdmin}
                    />
                    {form.formState.errors.firstName && (
                      <p className='text-xs text-destructive font-medium'>
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='lastName'>Last Name</Label>
                    <Input
                      id='lastName'
                      placeholder='Doe'
                      {...form.register('lastName')}
                      disabled={!isAdmin}
                    />
                    {form.formState.errors.lastName && (
                      <p className='text-xs text-destructive font-medium'>
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email'>Email Address</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='admin@example.com'
                    {...form.register('email')}
                    disabled={!isAdmin}
                  />
                  {form.formState.errors.email && (
                    <p className='text-xs text-destructive font-medium'>
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='password'>Temporary Password</Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    {...form.register('password')}
                    disabled={!isAdmin}
                  />
                  {form.formState.errors.password && (
                    <p className='text-xs text-destructive font-medium'>
                      {form.formState.errors.password.message}
                    </p>
                  )}
                  <p className='text-[10px] text-slate-400 font-medium'>
                    New admins are prompted to change this password after their first successful
                    login.
                  </p>
                </div>

                <Button
                  type='submit'
                  disabled={isSubmitting || !isAdmin}
                  className='w-full mt-2 font-bold'
                >
                  {isSubmitting ? 'Creating Manager...' : 'Create Manager Account'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
