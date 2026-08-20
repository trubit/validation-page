import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import type { ToastNotification } from '../types/auth';

interface NotificationToastProps {
  toast: ToastNotification | null;
  onDismiss: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="toast-icon success" size={20} aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="toast-icon error" size={20} aria-hidden="true" />;
      default:
        return <Info className="toast-icon info" size={20} aria-hidden="true" />;
    }
  };

  return (
    <div
      className={`toast-notification toast-${toast.type}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast-content">
        {renderIcon()}
        <span className="toast-message">{toast.message}</span>
      </div>
      <button
        type="button"
        className="toast-close-btn"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
};
