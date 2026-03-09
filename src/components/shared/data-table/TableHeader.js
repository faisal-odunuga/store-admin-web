'use client';

import React from 'react';
import { flexRender } from '@tanstack/react-table';
import { TableHead, TableHeader as ShadTableHeader, TableRow } from '@/components/ui/table';

const TableHeader = ({ table }) => {
  return (
    <ShadTableHeader className='bg-white/[0.02] border-b border-white/5'>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className='hover:bg-transparent border-none'>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                className='h-12 px-6 text-[10px] font-bold text-slate-500 tracking-widest uppercase items-center'
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </ShadTableHeader>
  );
};

export default TableHeader;
