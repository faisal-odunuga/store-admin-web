import * as React from 'react';
import { format } from 'date-fns';
import {
  ShieldCheck,
  Lock,
  Mail,
  UserCheck,
  ArrowUpRight,
  ShieldAlert,
  Fingerprint,
} from 'lucide-react';
import { toast } from 'sonner';
import { DataActions } from '@/components/shared/data-table/DataActions';
import DataStatus from '@/components/shared/data-table/DataStatus';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

export const getUsersColumns = () => [
  {
    accessorKey: 'name',
    header: 'Identity',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className='flex items-center gap-4 py-1 group'>
          <div className='h-11 w-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shadow-inner transition-transform group-hover:scale-110'>
            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className='flex flex-col min-w-0'>
            <span className='text-sm font-bold text-white truncate max-w-[180px] tracking-tight'>
              {user.name || 'Anonymous User'}
            </span>
            <span className='text-[10px] text-slate-400 font-extrabold truncate flex items-center gap-1.5 uppercase tracking-tighter'>
              <Mail size={10} className='text-primary/50' /> {user.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'clerkId',
    header: 'System ID',
    cell: ({ row }) => (
      <div className='hidden lg:flex items-center gap-2 group'>
        <Fingerprint
          size={12}
          className='text-slate-600 group-hover:text-primary transition-colors'
        />
        <code className='text-[10px] bg-white/5 px-2 py-1 rounded-lg border border-white/5 text-slate-400 font-mono font-bold tracking-widest'>
          {row.original.clerkId.slice(0, 12)}...
        </code>
      </div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Access Level',
    cell: ({ row }) => (
      <DataStatus
        status={row.original.role}
        labels={{
          ADMIN: 'Super Admin',
          MANAGER: 'Operator',
          CUSTOMER: 'Client',
          USER: 'End User',
        }}
        config={{
          bg: {
            ADMIN: 'bg-rose-500/10',
            MANAGER: 'bg-amber-500/10',
            CUSTOMER: 'bg-emerald-500/10',
            USER: 'bg-slate-500/10',
          },
          text: {
            ADMIN: 'text-rose-400',
            MANAGER: 'text-amber-400',
            CUSTOMER: 'text-emerald-400',
            USER: 'text-slate-400',
          },
          dot: {
            ADMIN: 'bg-rose-400',
            MANAGER: 'bg-amber-400',
            CUSTOMER: 'bg-emerald-400',
            USER: 'bg-slate-400',
          },
        }}
        icon={
          row.original.role === 'ADMIN'
            ? ShieldAlert
            : row.original.role === 'MANAGER'
              ? ShieldCheck
              : undefined
        }
      />
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Registration',
    cell: ({ row }) => (
      <div className='hidden md:flex flex-col gap-0.5'>
        <span className='text-xs text-white font-bold opacity-80'>
          {format(new Date(row.original.createdAt), 'MMM dd, yyyy')}
        </span>
        <span className='text-[9px] text-slate-400 font-extrabold uppercase tracking-widest'>
          Official Entry
        </span>
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className='flex justify-end'>
        <DataActions>
          <DropdownMenuItem className='text-xs font-bold text-slate-400 focus:text-white focus:bg-white/5 rounded-lg m-1 cursor-pointer gap-2'>
            <UserCheck className='h-3.5 w-3.5' />
            <span>View Activity</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='text-xs font-bold text-slate-400 focus:text-white focus:bg-white/5 rounded-lg m-1 cursor-pointer gap-2'>
            <ShieldCheck className='h-3.5 w-3.5' />
            <span>Elevate Privileges</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className='bg-white/5' />
          <DropdownMenuItem
            className='text-xs font-bold text-slate-400 focus:text-white focus:bg-white/5 rounded-lg m-1 cursor-pointer gap-2'
            onClick={() => {
              navigator.clipboard.writeText(row.original.id);
              toast.success('Internal ID copied to clipboard');
            }}
          >
            <ArrowUpRight size={14} />
            <span>Trace Database ID</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='text-rose-400 focus:text-rose-300 focus:bg-rose-500/10 rounded-lg m-1 cursor-pointer gap-2'>
            <Lock className='h-3.5 w-3.5' />
            <span>Restrict Access</span>
          </DropdownMenuItem>
        </DataActions>
      </div>
    ),
  },
];
