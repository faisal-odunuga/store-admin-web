'use client';
import TabItem from './TabItem';

export interface ITabItem {
  label: string;
  value: string;
  count?: number;
}

interface TableTabsProps {
  tabs: ITabItem[];
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TableTabs = ({ tabs, activeTab, setActiveTab }: TableTabsProps) => {
  return (
    <div className='flex items-center gap-6 border-b border-slate-100 overflow-x-auto no-scrollbar'>
      {tabs.map((tab) => (
        <TabItem key={tab.value} item={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
      ))}
    </div>
  );
};

export default TableTabs;
