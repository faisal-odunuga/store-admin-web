'use client';

import * as React from 'react';
import { UserPlus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthMe } from '@/hooks/useAuthMe';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { getUsersColumns } from './UsersColumns';

export function UsersTable({
  data = [],
  onRefetch,
  pageCount,
  onPaginationChange,
  paginationState,
  isLoading = false,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: me } = useAuthMe();
  const currentRole = searchParams.get('role') || 'all';

  const tableData = React.useMemo(() => {
    return data.filter((user) => user.clerkId !== me?.clerkId);
  }, [data, me]);

  const setRoleFilter = (role) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!role || role === 'all') {
      params.delete('role');
    } else {
      params.set('role', role);
    }
    params.set('page', '1');
    router.push(`/users?${params.toString()}`);
  };

  const columns = React.useMemo(() => getUsersColumns(), []);

  const roleCounts = React.useMemo(() => {
    let admin = 0;
    let manager = 0;
    let customer = 0;

    tableData.forEach((user) => {
      if (user.role === 'ADMIN') admin += 1;
      else if (user.role === 'MANAGER') manager += 1;
      else if (user.role === 'CUSTOMER') customer += 1;
    });

    return { total: tableData.length, admin, manager, customer };
  }, [tableData]);

  const tabs = React.useMemo(
    () => [
      { label: 'Active Directory', value: 'all', count: roleCounts.total },
      { label: 'Authorities', value: 'ADMIN', count: roleCounts.admin },
      { label: 'Ops Personnel', value: 'MANAGER', count: roleCounts.manager },
      { label: 'Client Base', value: 'CUSTOMER', count: roleCounts.customer },
    ],
    [roleCounts],
  );

  return (
    <DataTable
      columns={columns}
      data={tableData}
      searchPlaceholder='Search database by name, email or system signature...'
      tabs={tabs}
      activeTab={currentRole}
      onTabChange={(val) => setRoleFilter(val || 'all')}
      onRefetch={onRefetch}
      manualPagination={!!onPaginationChange}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      paginationState={paginationState}
      isLoading={isLoading}
      rightElement={
        <Button className='bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-xl flex gap-3 shadow-lg shadow-primary/20 transition-all'>
          <UserPlus className='h-5 w-5' />
          <span className='hidden sm:inline'>Invite User</span>
        </Button>
      }
    />
  );
}
