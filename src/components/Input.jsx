import React from 'react'
import { clsx } from 'clsx'

export function Input({ 
  type = 'text', 
  placeholder = '', 
  className = '', 
  icon: Icon,
  ...props 
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={clsx(
          'w-full h-10 px-3 rounded-lg glass-effect text-white placeholder-gray-400 border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all',
          Icon && 'pl-10',
          className
        )}
        {...props}
      />
    </div>
  )
}