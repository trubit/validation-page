import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  label?: string;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label = 'Password',
  error,
  className = '',
  required,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const errorId = `${id}-error`;

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-star" aria-hidden="true">*</span>}
      </label>
      <div className={`input-wrapper ${error ? 'has-error' : ''}`}>
        <span className="input-icon-left">
          <Lock size={18} aria-hidden="true" />
        </span>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={`form-input has-left-icon has-right-icon ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          required={required}
          {...props}
        />
        <button
          type="button"
          className="input-icon-right-btn"
          onClick={toggleVisibility}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={0}
        >
          {showPassword ? (
            <EyeOff size={18} aria-hidden="true" />
          ) : (
            <Eye size={18} aria-hidden="true" />
          )}
        </button>
      </div>
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
