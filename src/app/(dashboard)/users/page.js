'use client';

import React from 'react';
import { UsersTable } from '@/components/sections/users/UsersTable';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/lib/apiService';

const useUsersData = (filters = {}) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersService.getAll(filters),
  });
};

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const role = searchParams.get('role') || undefined;

  const { data, isLoading, refetch } = useUsersData({
    page,
    role,
    limit: 10,
  });

  const handlePaginationChange = (updater) => {
    const newState =
      typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize: 10 }) : updater;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', (newState.pageIndex + 1).toString());
    router.push(`/users?${params.toString()}`);
  };

  const paginationState = {
    pageIndex: page - 1,
    pageSize: 10,
  };

  return (
    <div className='space-y-8 pb-10'>
      <div className='animate-in'>
        <h1 className='text-3xl font-extrabold text-foreground tracking-tight mb-2 uppercase'>
          Directory Control
        </h1>
        <p className='text-muted-foreground font-medium'>
          Oversee user accounts, assign privileges and monitor platform access.
        </p>
      </div>

      <div className='animate-in' style={{ animationDelay: '0.1s' }}>
        <UsersTable
          data={data?.users || []}
          isLoading={isLoading}
          onRefetch={refetch}
          pageCount={data?.totalPages || 1}
          onPaginationChange={handlePaginationChange}
          paginationState={paginationState}
        />
      </div>
    </div>
  );
}
