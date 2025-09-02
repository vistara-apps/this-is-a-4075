import React from 'react'
import { clsx } from 'clsx'

const variants = {
  default: 'card-surface',
  elevated: 'card-surface shadow-lg'
}

export function Card({ children, variant = 'default', className = '', ...props }) {
  return (
    <div
      className={clsx(
        'rounded-lg p-6',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}