import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = 'md',
  text,
  fullScreen = false
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 20,
    md: 32,
    lg: 48,
    xl: 64
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-green-700" size={sizeMap[size]} />
      {text && (
        <p className="text-stone-600 text-lg">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {content}
      </div>
    );
  }

  return content;
}
