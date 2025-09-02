import React from 'react'
import { clsx } from 'clsx'

const variants = {
  primary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg',
  secondary: 'glass-effect text-white hover:bg-white/10',
  outline: 'border border-white/20 text-white hover:bg-white/5',
  destructive: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'text-white hover:bg-white/5',
  link: 'text-purple-400 hover:text-purple-300 underline-offset-4 hover:underline'
}

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4',
  lg: 'h-12 px-6 text-lg'
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}