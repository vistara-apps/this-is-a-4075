/**
 * Custom hook for toast notifications
 */
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { ExternalLink } from 'lucide-react';
import { TOAST_DURATION } from '../config/constants';
import { getExplorerUrl } from '../utils/solana';

/**
 * Custom hook for toast notifications
 * @returns {Object} Toast notification methods
 */
export function useToast() {
  /**
   * Show success toast
   * @param {string} message - Success message
   * @param {Object} options - Toast options
   */
  const success = useCallback((message, options = {}) => {
    toast.success(message, {
      duration: options.duration || TOAST_DURATION.SHORT,
      ...options,
    });
  }, []);

  /**
   * Show error toast
   * @param {string|Error} error - Error message or Error object
   * @param {Object} options - Toast options
   */
  const error = useCallback((error, options = {}) => {
    const message = error instanceof Error ? error.message : error;
    toast.error(message, {
      duration: options.duration || TOAST_DURATION.MEDIUM,
      ...options,
    });
  }, []);

  /**
   * Show info toast
   * @param {string} message - Info message
   * @param {Object} options - Toast options
   */
  const info = useCallback((message, options = {}) => {
    toast(message, {
      duration: options.duration || TOAST_DURATION.MEDIUM,
      ...options,
    });
  }, []);

  /**
   * Show loading toast
   * @param {string} message - Loading message
   * @param {Object} options - Toast options
   * @returns {string} Toast ID for dismissing
   */
  const loading = useCallback((message, options = {}) => {
    return toast.loading(message, {
      ...options,
    });
  }, []);

  /**
   * Update existing toast
   * @param {string} id - Toast ID
   * @param {string} message - New message
   * @param {string} type - Toast type (success, error, loading)
   * @param {Object} options - Toast options
   */
  const update = useCallback((id, message, type = 'default', options = {}) => {
    toast.dismiss(id);
    
    switch (type) {
      case 'success':
        success(message, options);
        break;
      case 'error':
        error(message, options);
        break;
      case 'loading':
        loading(message, options);
        break;
      default:
        info(message, options);
    }
  }, [success, error, info, loading]);

  /**
   * Dismiss toast
   * @param {string} id - Toast ID
   */
  const dismiss = useCallback((id) => {
    toast.dismiss(id);
  }, []);

  /**
   * Show transaction toast with explorer link
   * @param {string} signature - Transaction signature
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error)
   */
  const transaction = useCallback((signature, message, type = 'success') => {
    const explorerUrl = getExplorerUrl(signature);
    
    toast[type](
      (t) => (
        <div className="flex items-start">
          <div className="flex-1">{message}</div>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 p-1 text-purple-400 hover:text-purple-300"
            onClick={() => toast.dismiss(t.id)}
          >
            <ExternalLink size={16} />
          </a>
        </div>
      ),
      {
        duration: TOAST_DURATION.MEDIUM,
      }
    );
  }, []);

  return {
    success,
    error,
    info,
    loading,
    update,
    dismiss,
    transaction,
  };
}

