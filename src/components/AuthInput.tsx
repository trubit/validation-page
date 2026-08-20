import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  id,
  label,
  error,
  icon,
  className = '',
  required,
  ...props
}) => {
  const errorId = `${id}-error`;

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-star" aria-hidden="true">*</span>}
      </label>
      <div className={`input-wrapper ${error ? 'has-error' : ''}`}>
        {icon && <span className="input-icon-left">{icon}</span>}
        <input
          id={id}
          className={`form-input ${icon ? 'has-left-icon' : ''} ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          required={required}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
