import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  hoverable?: boolean;
}

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  onClick,
  hoverable = false
}: CardProps) {
  const variantStyles = {
    default: 'bg-white border border-stone-200',
    elevated: 'bg-white shadow-lg border border-stone-200',
    bordered: 'bg-white border-2 border-stone-300'
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const interactiveStyles = onClick || hoverable
    ? 'cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1'
    : '';

  return (
    <div
      className={`rounded-2xl ${variantStyles[variant]} ${paddingStyles[padding]} ${interactiveStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
