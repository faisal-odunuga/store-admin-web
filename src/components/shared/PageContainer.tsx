import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function PageContainer({ children, title, description, action }: PageContainerProps) {
  return (
    <div className='flex-1 overflow-y-auto p-4 md:p-8 bg-background-light dark:bg-background-dark min-h-full'>
      {(title || action) && (
        <div className='flex justify-between items-start md:items-center mb-8 gap-4 flex-col md:flex-row'>
          <div>
            {title && (
              <h2 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight'>
                {title}
              </h2>
            )}
            {description && (
              <p className='text-slate-500 dark:text-slate-400 mt-1'>{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
