import React, { useState } from 'react';
import { clsx } from 'clsx';

/**
 * Tab item component
 * @param {Object} props - Component props
 * @param {string} props.id - Tab ID
 * @param {string} props.label - Tab label
 * @param {boolean} props.active - Whether the tab is active
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
export function TabItem({ id, label, active, onClick, className, ...props }) {
  return (
    <button
      id={`tab-${id}`}
      role="tab"
      aria-selected={active}
      aria-controls={`tabpanel-${id}`}
      className={clsx(
        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
        active
          ? 'bg-purple-600/20 text-purple-400'
          : 'text-gray-400 hover:text-white hover:bg-white/5',
        className
      )}
      onClick={() => onClick(id)}
      {...props}
    >
      {label}
    </button>
  );
}

/**
 * Tab panel component
 * @param {Object} props - Component props
 * @param {string} props.id - Tab ID
 * @param {boolean} props.active - Whether the tab is active
 * @param {React.ReactNode} props.children - Tab content
 * @param {string} props.className - Additional CSS classes
 */
export function TabPanel({ id, active, children, className, ...props }) {
  if (!active) return null;
  
  return (
    <div
      id={`tabpanel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      className={clsx('mt-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Tabs component
 * @param {Object} props - Component props
 * @param {Array} props.tabs - Array of tab objects with id and label
 * @param {string} props.defaultTab - Default active tab ID
 * @param {function} props.onChange - Change handler
 * @param {string} props.variant - Tab variant (default, underline)
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Tab panels
 */
export function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  className,
  children,
  ...props
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs.length > 0 ? tabs[0].id : ''));

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'underline':
        return 'border-b border-white/10 pb-0 gap-0';
      default:
        return 'bg-white/5 p-1 rounded-lg';
    }
  };

  // Get tab item styles
  const getTabItemStyles = (isActive) => {
    if (variant === 'underline') {
      return clsx(
        'px-4 py-2 text-sm font-medium border-b-2 rounded-none',
        isActive
          ? 'border-purple-500 text-purple-400'
          : 'border-transparent text-gray-400 hover:text-white hover:border-white/20'
      );
    }
    return '';
  };

  return (
    <div className={className} {...props}>
      <div
        role="tablist"
        className={clsx('flex space-x-1', getVariantStyles())}
      >
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            id={tab.id}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={handleTabChange}
            className={getTabItemStyles(activeTab === tab.id)}
          />
        ))}
      </div>
      
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        
        return React.cloneElement(child, {
          active: activeTab === child.props.id,
        });
      })}
    </div>
  );
}

