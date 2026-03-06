'use client';
import { ITabItem } from '.';

const TabItem = ({
  item,
  activeTab,
  setActiveTab,
}: {
  item: ITabItem;
  activeTab: string;
  setActiveTab: (value: string) => void;
}) => {
  const { label, value, count } = item;
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`pb-3 text-xs font-bold transition-all relative ${
        isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <span className='flex items-center gap-1.5 whitespace-nowrap'>
        {label}
        {count !== undefined && (
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              isActive ? 'bg-indigo-50' : 'bg-slate-100'
            }`}
          >
            {count}
          </span>
        )}
      </span>
      {isActive && (
        <div className='absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full' />
      )}
    </button>
  );
};

export default TabItem;
