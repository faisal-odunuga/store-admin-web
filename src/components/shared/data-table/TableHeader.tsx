import { flexRender } from '@tanstack/react-table';

import { TableHead, TableHeader as ShadTableHeader, TableRow } from '@/components/ui/table';
import { Table } from '@tanstack/react-table';

const TableHeader = <TData,>({ table }: { table: Table<TData> }) => {
  return (
    <ShadTableHeader className='bg-slate-50/80 uppercase'>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className='hover:bg-transparent border-b border-slate-200'>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                className='h-10 px-4 text-[10px] font-bold text-slate-500 tracking-wider'
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
