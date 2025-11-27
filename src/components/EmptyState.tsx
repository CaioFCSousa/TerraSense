import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-stone-400 mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-stone-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-stone-600 mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}
