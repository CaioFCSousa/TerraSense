import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helperText?: string;
}

export default function Input({
  label,
  error,
  icon,
  helperText,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-stone-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3.5 text-stone-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 border ${
            error ? 'border-red-500' : 'border-stone-300'
          } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-stone-500">{helperText}</p>
      )}
    </div>
  );
}
