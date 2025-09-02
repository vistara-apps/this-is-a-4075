import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * Alert component for displaying notifications
 * @param {Object} props - Component props
 * @param {string} props.variant - Alert variant (info, warning, danger, success)
 * @param {string} props.title - Alert title
 * @param {string} props.message - Alert message
 * @param {boolean} props.dismissible - Whether the alert can be dismissed
 * @param {function} props.onDismiss - Callback when alert is dismissed
 * @param {React.ReactNode} props.children - Alert content
 * @param {string} props.className - Additional CSS classes
 */
export function Alert({
  variant = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  children,
  className,
  ...props
}) {
  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'info':
        return 'bg-blue-600/10 border-blue-500/20 text-blue-400';
      case 'warning':
        return 'bg-yellow-600/10 border-yellow-500/20 text-yellow-400';
      case 'danger':
        return 'bg-red-600/10 border-red-500/20 text-red-400';
      case 'success':
        return 'bg-green-600/10 border-green-500/20 text-green-400';
      default:
        return 'bg-blue-600/10 border-blue-500/20 text-blue-400';
    }
  };

  // Get variant icon
  const getVariantIcon = () => {
    switch (variant) {
      case 'info':
        return <Info className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'danger':
        return <XCircle className="h-5 w-5" />;
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div
      className={clsx(
        'p-4 rounded-lg border flex items-start',
        getVariantStyles(),
        className
      )}
      role="alert"
      {...props}
    >
      <div className="mr-3 mt-0.5">{getVariantIcon()}</div>
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        {message && <p className={title ? 'mt-1 text-sm opacity-80' : ''}>{message}</p>}
        {children}
      </div>
      {dismissible && (
        <button
          type="button"
          className="ml-3 p-1 rounded-full hover:bg-white/10"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

