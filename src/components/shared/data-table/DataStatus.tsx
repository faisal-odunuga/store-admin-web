const DataStatus = ({
  status,
  labels,
  config,
  icon: Icon,
}: {
  status: string;
  labels?: Record<string, string>;
  config?: {
    bg?: Record<string, string>;
    text?: Record<string, string>;
    dot?: Record<string, string>;
  };
  icon?: React.ElementType;
}) => {
  const label = labels?.[status] || status;
  const bgColor = config?.bg?.[status] || 'bg-slate-50';
  const textColor = config?.text?.[status] || 'text-slate-600';
  const dotColor = config?.dot?.[status] || 'bg-slate-400';

  return (
    <div
      className={`flex items-center justify-center w-fit h-6 px-2.5 gap-2 rounded-full text-[10px] font-bold uppercase tracking-wider ${bgColor} ${textColor} border border-black/5 whitespace-nowrap`}
    >
      {Icon ? (
        <Icon size={12} className='opacity-80' />
      ) : (
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      )}
      {label}
    </div>
  );
};

export default DataStatus;
