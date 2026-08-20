import { useState } from 'react';
import type { AuthMode, ToastNotification } from './types/auth';
import { AuthLayout } from './components/AuthLayout';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { NotificationToast } from './components/NotificationToast';

function App() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({
      id: Math.random().toString(36).substring(2, 9),
      type,
      message,
    });
  };

  const handleAuthSuccess = (message: string) => {
    showToast('success', message);
  };

  const handleAuthError = (message: string) => {
    showToast('error', message);
  };

  return (
    <>
      <AuthLayout>
        {mode === 'login' ? (
          <LoginForm
            onSwitchMode={(newMode) => setMode(newMode)}
            onOpenForgotPassword={() => setIsForgotPasswordOpen(true)}
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
          />
        ) : (
          <SignupForm
            onSwitchMode={(newMode) => setMode(newMode)}
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
          />
        )}
      </AuthLayout>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onSuccess={(msg) => showToast('info', msg)}
      />

      <NotificationToast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}

export default App;
