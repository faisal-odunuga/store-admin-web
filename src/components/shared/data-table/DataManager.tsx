import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DataManager = ({ name, image }: { name: string; image?: string }) => {
  return (
    <div className='flex items-center gap-2'>
      <Avatar className='w-7 h-7 rounded-full border border-slate-200'>
        {image && <AvatarImage src={image} />}
        <AvatarFallback className='text-[10px] font-bold bg-indigo-50 text-indigo-600'>
          {name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </AvatarFallback>
      </Avatar>
      <span className='text-sm font-medium text-slate-700'>{name}</span>
    </div>
  );
};

export default DataManager;
