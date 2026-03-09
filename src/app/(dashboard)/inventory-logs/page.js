'use client';

import React from 'react';
import { useInventoryLogs } from '@/hooks/useInventoryLogs';
import { InventoryLogsTable } from '@/components/sections/inventory/InventoryLogsTable';
import { useSearchParams } from 'next/navigation';

export default function InventoryLogsPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const type = searchParams.get('type') || undefined;

  const { data, isLoading, refetch } = useInventoryLogs({
    page,
    type,
    limit: 15,
  });

  return (
    <div className='space-y-8 pb-10'>
      <div className='animate-in'>
        <h1 className='text-3xl font-extrabold text-white tracking-tight mb-2 uppercase'>
          Activity Registry
        </h1>
        <p className='text-slate-400 font-medium'>
          Detailed audit trail of all inventory movements and manual adjustments.
        </p>
      </div>

      <div className='animate-in' style={{ animationDelay: '0.1s' }}>
        <InventoryLogsTable
          data={data?.logs || []}
          isLoading={isLoading}
          onRefetch={refetch}
          pageCount={data?.totalPages || 1}
        />
      </div>
    </div>
  );
}
