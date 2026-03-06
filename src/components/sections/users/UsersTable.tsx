'use client';

import * as React from 'react';
import { ColumnDef, createColumnHelper, OnChangeFn, PaginationState } from '@tanstack/react-table';
import {
  User as UserIcon,
  ShieldCheck,
  Calendar,
  Lock,
  Mail,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { User } from '@/types/user';
import { format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/shared/data-table';
import { DataActions } from '@/components/shared/data-table/DataActions';
import DataStatus from '@/components/shared/data-table/DataStatus';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const columnHelper = createColumnHelper<User>();

interface UsersTableProps {
  data: User[];
  onRefetch?: () => void;
  pageCount?: number;
  onPaginationChange?: OnChangeFn<PaginationState>;
  paginationState?: PaginationState;
}

export function UsersTable({
  data,
  onRefetch,
  pageCount,
  onPaginationChange,
  paginationState,
}: UsersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRole = searchParams.get('role') || 'all';

  const setRoleFilter = (role: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!role || role === 'all') {
      params.delete('role');
    } else {
      params.set('role', role);
    }
    params.set('page', '1'); // Reset to page 1 on filter change
    router.push(`/users?${params.toString()}`);
  };

  const roleFilter = currentRole;
  const columns: ColumnDef<User, unknown>[] = [
    columnHelper.accessor('name', {
      header: () => (
        <span className='flex items-center gap-2'>
          <UserIcon size={14} className='text-slate-400' /> Customer
        </span>
      ),
      cell: (info) => {
        const user = info.row.original;
        return (
          <div className='flex items-center gap-3 py-1'>
            <div className='h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs ring-1 ring-indigo-50/50'>
              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className='flex flex-col min-w-0'>
              <span className='text-sm font-bold text-slate-900 truncate max-w-[150px]'>
                {user.name}
              </span>
              <span className='text-[10px] text-slate-400 font-medium truncate flex items-center gap-1'>
                <Mail size={10} /> {user.email}
              </span>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('clerkId', {
      header: () => (
        <span className='flex items-center gap-2'>
          <Lock size={12} className='text-slate-400' /> Clerk ID
        </span>
      ),
      cell: (info) => (
        <code className='text-[10px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-slate-400 font-mono'>
          {info.getValue() as string}
        </code>
      ),
    }),
    columnHelper.accessor('role', {
      header: () => <span className='flex items-center gap-2 text-slate-400'>ROLE</span>,
      cell: (info) => {
        const role = info.getValue() as string;
        return (
          <DataStatus
            status={role}
            labels={{
              ADMIN: 'Admin',
              MANAGER: 'Manager',
              CUSTOMER: 'Customer',
              USER: 'User',
            }}
            config={{
              bg: {
                ADMIN: 'bg-rose-50',
                MANAGER: 'bg-amber-50',
                CUSTOMER: 'bg-emerald-50',
                USER: 'bg-slate-50',
              },
              text: {
                ADMIN: 'text-rose-600',
                MANAGER: 'text-amber-600',
                CUSTOMER: 'text-emerald-600',
                USER: 'text-slate-600',
              },
              dot: {
                ADMIN: 'bg-rose-500',
                MANAGER: 'bg-amber-500',
                CUSTOMER: 'bg-emerald-500',
                USER: 'bg-slate-500',
              },
            }}
          />
        );
      },
    }),
    columnHelper.accessor('createdAt', {
      header: () => (
        <span className='flex items-center gap-2'>
          <Calendar size={14} className='text-slate-400' /> Joined At
        </span>
      ),
      cell: (info) => (
        <span className='text-sm text-slate-500 font-medium'>
          {format(new Date(info.getValue()), 'MMM dd, yyyy')}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: () => (
        <DataActions>
          <DropdownMenuItem>
            <UserCheck className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShieldCheck className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Change Role
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='text-rose-600'>Copy DB ID</DropdownMenuItem>
        </DataActions>
      ),
    }),
  ];

  // Filtering is now handled server-side via URL params
  const tableData = data;

  const roleCounts = React.useMemo(() => {
    let admin = 0;
    let manager = 0;
    let customer = 0;

    data.forEach((user) => {
      if (user.role === 'ADMIN') admin += 1;
      else if (user.role === 'MANAGER') manager += 1;
      else if (user.role === 'CUSTOMER') customer += 1;
    });

    return {
      total: data.length,
      admin,
      manager,
      customer,
    };
  }, [data]);

  const tabs = React.useMemo(
    () => [
      { label: 'All Users', value: 'all', count: roleCounts.total },
      { label: 'Admins', value: 'ADMIN', count: roleCounts.admin },
      { label: 'Managers', value: 'MANAGER', count: roleCounts.manager },
      { label: 'Customers', value: 'CUSTOMER', count: roleCounts.customer },
    ],
    [roleCounts],
  );

  return (
    <div className='w-full'>
      <DataTable
        columns={columns}
        data={tableData}
        searchPlaceholder='Search users by name, email, clerk id...'
        tabs={tabs}
        activeTab={roleFilter ?? 'all'}
        onTabChange={(val) => setRoleFilter(val || 'all')}
        onRefetch={onRefetch}
        manualPagination={!!onPaginationChange}
        pageCount={pageCount}
        onPaginationChange={onPaginationChange}
        paginationState={paginationState}
        rightElement={
          <Button className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 px-4 rounded-lg flex gap-2 text-xs transition-all'>
            <UserPlus className='h-4 w-4' /> Add user
          </Button>
        }
      />
    </div>
  );
}
