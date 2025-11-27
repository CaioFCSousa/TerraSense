import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-green-700 hover:bg-green-800 text-white shadow-md hover:shadow-lg focus:ring-green-500 disabled:bg-green-400',
    secondary: 'bg-stone-800 hover:bg-stone-900 text-white shadow-md hover:shadow-lg focus:ring-stone-500 disabled:bg-stone-400',
    outline: 'border-2 border-stone-300 text-stone-700 hover:bg-stone-50 focus:ring-stone-500 disabled:border-stone-200 disabled:text-stone-400',
    ghost: 'text-stone-700 hover:bg-stone-100 focus:ring-stone-500 disabled:text-stone-400'
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm space-x-2',
    md: 'px-6 py-3 text-base space-x-2',
    lg: 'px-8 py-4 text-lg space-x-3'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
      ) : icon}
      <span>{children}</span>
    </button>
  );
}
