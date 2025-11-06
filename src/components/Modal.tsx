import { ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className={`bg-white rounded-2xl w-full ${sizeStyles[size]} max-h-[90vh] overflow-hidden shadow-2xl`}
      >
        {(title || showCloseButton) && (
          <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex justify-between items-center">
            {title && <h2 className="text-2xl font-bold text-stone-900">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-stone-500 hover:text-stone-700 p-2 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
