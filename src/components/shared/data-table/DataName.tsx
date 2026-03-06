import { ExternalLink } from 'lucide-react';

const DataName = ({ name }: { name: string }) => {
  return (
    <div className='flex flex-row items-center gap-3 py-2 cursor-pointer group w-full max-w-[320px]'>
      <h1 className='font-medium text-sm text-indigo-600 hover:border-b hover:border-indigo-600 border-b border-transparent w-fit truncate'>
        {name}
      </h1>
      <ExternalLink className='w-4 h-4 text-slate-400 invisible group-hover:visible transition-all' />
    </div>
  );
};

export default DataName;
