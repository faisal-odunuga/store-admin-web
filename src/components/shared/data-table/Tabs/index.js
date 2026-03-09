'use client';

import React from 'react';
import TabItem from './TabItem';

const TableTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className='flex items-center gap-8 border-b border-white/5 overflow-x-auto no-scrollbar pt-2 px-1'>
      {tabs.map((tab) => (
        <TabItem key={tab.value} item={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
      ))}
    </div>
  );
};

export default TableTabs;
