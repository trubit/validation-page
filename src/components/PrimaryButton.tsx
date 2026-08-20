import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  showArrow?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  isLoading = false,
  showArrow = true,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`btn-primary ${isLoading ? 'is-loading' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="btn-loading-content">
          <Loader2 className="spinner-icon" size={18} aria-hidden="true" />
          <span>Processing...</span>
        </span>
      ) : (
        <span className="btn-content">
          <span>{children}</span>
          {showArrow && <ArrowRight size={18} className="btn-arrow" aria-hidden="true" />}
        </span>
      )}
    </button>
  );
};
