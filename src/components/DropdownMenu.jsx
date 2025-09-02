import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

/**
 * Dropdown menu item component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Item content
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether the item is disabled
 * @param {string} props.className - Additional CSS classes
 */
export function DropdownMenuItem({ children, onClick, disabled, className, ...props }) {
  return (
    <button
      type="button"
      className={clsx(
        'w-full text-left px-3 py-2 text-sm rounded transition-colors',
        disabled
          ? 'text-gray-500 cursor-not-allowed'
          : 'text-white hover:bg-white/10',
        className
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Dropdown menu component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.trigger - Trigger element
 * @param {React.ReactNode} props.children - Dropdown content
 * @param {string} props.align - Dropdown alignment (left, right)
 * @param {string} props.className - Additional CSS classes
 */
export function DropdownMenu({
  trigger,
  children,
  align = 'left',
  className,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Default trigger if none provided
  const defaultTrigger = (
    <button
      type="button"
      className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-md"
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      <span>Options</span>
      <ChevronDown className="h-4 w-4" />
    </button>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || defaultTrigger}
      </div>
      
      {isOpen && (
        <div
          className={clsx(
            'absolute z-10 mt-2 w-56 rounded-md bg-gray-800 shadow-lg border border-white/10',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
          {...props}
        >
          <div className="p-2 space-y-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

