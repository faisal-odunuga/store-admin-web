import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function DataActions({ children, className }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className={cn(
            'h-9 w-9 p-0 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all',
            className,
          )}
        >
          <MoreVertical className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='glass-morphism border-white/10 rounded-2xl min-w-[180px] p-2 shadow-2xl'
        sideOffset={8}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
