import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

/**
 * Tooltip component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Tooltip trigger element
 * @param {string} props.content - Tooltip content
 * @param {string} props.position - Tooltip position (top, right, bottom, left)
 * @param {string} props.className - Additional CSS classes
 */
export function Tooltip({
  children,
  content,
  position = 'top',
  className,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  // Position the tooltip
  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const trigger = triggerRef.current.getBoundingClientRect();
      const tooltip = tooltipRef.current;
      
      // Reset position
      tooltip.style.top = '';
      tooltip.style.right = '';
      tooltip.style.bottom = '';
      tooltip.style.left = '';
      
      // Set position based on position prop
      switch (position) {
        case 'top':
          tooltip.style.bottom = `${window.innerHeight - trigger.top + 8}px`;
          tooltip.style.left = `${trigger.left + trigger.width / 2}px`;
          tooltip.style.transform = 'translateX(-50%)';
          break;
        case 'right':
          tooltip.style.top = `${trigger.top + trigger.height / 2}px`;
          tooltip.style.left = `${trigger.right + 8}px`;
          tooltip.style.transform = 'translateY(-50%)';
          break;
        case 'bottom':
          tooltip.style.top = `${trigger.bottom + 8}px`;
          tooltip.style.left = `${trigger.left + trigger.width / 2}px`;
          tooltip.style.transform = 'translateX(-50%)';
          break;
        case 'left':
          tooltip.style.top = `${trigger.top + trigger.height / 2}px`;
          tooltip.style.right = `${window.innerWidth - trigger.left + 8}px`;
          tooltip.style.transform = 'translateY(-50%)';
          break;
        default:
          tooltip.style.bottom = `${window.innerHeight - trigger.top + 8}px`;
          tooltip.style.left = `${trigger.left + trigger.width / 2}px`;
          tooltip.style.transform = 'translateX(-50%)';
      }
    }
  }, [isVisible, position]);

  // Get position arrow class
  const getPositionArrowClass = () => {
    switch (position) {
      case 'top':
        return 'after:bottom-full after:border-b-0 after:border-t-gray-800';
      case 'right':
        return 'after:left-full after:border-l-0 after:border-r-gray-800';
      case 'bottom':
        return 'after:top-full after:border-t-0 after:border-b-gray-800';
      case 'left':
        return 'after:right-full after:border-r-0 after:border-l-gray-800';
      default:
        return 'after:bottom-full after:border-b-0 after:border-t-gray-800';
    }
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={clsx(
            'fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded',
            'after:absolute after:border-4 after:border-transparent',
            getPositionArrowClass(),
            className
          )}
          {...props}
        >
          {content}
        </div>
      )}
    </div>
  );
}

