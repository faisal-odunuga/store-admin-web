'use client';
import React from 'react';
import { PageContainer } from '@/components/shared/PageContainer';
import { ErrorState } from '@/components/shared/ErrorState';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { UsersTable } from '@/components/sections/users/UsersTable';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter, useSearchParams } from 'next/navigation';
import { OnChangeFn, PaginationState } from '@tanstack/react-table';

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const role = searchParams.get('role') || 'all';

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: limit,
  };

  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', (newPagination.pageIndex + 1).toString());
    params.set('limit', newPagination.pageSize.toString());
    router.push(`/users?${params.toString()}`);
  };

  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
  } = useUsers({
    page,
    limit,
    role: role === 'all' ? undefined : role,
  });

  React.useEffect(() => {
    document.title = 'Customers | Antigravity Store';
  }, []);

  if (isLoading) {
    return (
      <PageContainer
        title='Customers'
        description='Manage your customer base and identify VIP buyers.'
      >
        <div className='space-y-4'>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className='h-16 w-full rounded-xl' />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (isError || !usersData) {
    return (
      <PageContainer title='Customers'>
        <ErrorState message='Failed to load customers.' onRetry={() => refetch()} />
      </PageContainer>
    );
  }

  const users = usersData.users;

  return (
    <PageContainer
      title='Customers'
      description='Manage your customer base and identify VIP buyers.'
      action={
        <Button className='bg-primary hover:bg-primary/90 text-white font-bold h-10 px-5 flex gap-2 shadow-sm rounded-lg'>
          <UserPlus className='h-5 w-5' /> Add Customer
        </Button>
      }
    >
      <UsersTable
        data={users}
        onRefetch={refetch}
        pageCount={usersData.totalPages}
        onPaginationChange={setPagination}
        paginationState={pagination}
      />
    </PageContainer>
  );
}
