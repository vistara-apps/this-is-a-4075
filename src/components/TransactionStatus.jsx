import React from 'react';
import { Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { getExplorerUrl } from '../utils/solana';

/**
 * Transaction status component
 * @param {Object} props - Component props
 * @param {string} props.status - Transaction status (pending, success, error)
 * @param {string} props.signature - Transaction signature
 * @param {string} props.message - Status message
 * @param {string} props.error - Error message (if status is error)
 */
export function TransactionStatus({ status, signature, message, error }) {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-5 w-5 text-yellow-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600/20 border-yellow-500/20';
      case 'success':
        return 'bg-green-600/20 border-green-500/20';
      case 'error':
        return 'bg-red-600/20 border-red-500/20';
      default:
        return 'bg-gray-600/20 border-gray-500/20';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Transaction in progress...';
      case 'success':
        return message || 'Transaction successful';
      case 'error':
        return error || 'Transaction failed';
      default:
        return '';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()} mb-4`}>
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">{getStatusIcon()}</div>
        <div className="flex-1">
          <p className="font-medium text-white">{getStatusText()}</p>
          
          {status === 'error' && error && (
            <p className="text-sm text-red-400 mt-1">{error}</p>
          )}
          
          {signature && (
            <div className="mt-2">
              <a
                href={getExplorerUrl(signature)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-400 hover:text-purple-300 flex items-center"
              >
                View on Explorer
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

