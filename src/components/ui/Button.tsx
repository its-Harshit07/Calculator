import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/utils'

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'default' | 'operator' | 'action' | 'equals'
  size?: 'default' | 'sm' | 'lg'
}

export const CalcButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        ref={ref}
        className={cn(
          "relative flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-white/5 hover:bg-white/10 dark:bg-black/20 dark:hover:bg-black/30 text-foreground': variant === 'default',
            'bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 text-foreground': variant === 'action',
            'bg-primary/10 hover:bg-primary/20 text-primary-foreground': variant === 'operator',
            'bg-blue-600 hover:bg-blue-700 text-white shadow-md': variant === 'equals',
            'h-12 w-full': size === 'default',
            'h-10 w-full': size === 'sm',
            'h-16 w-full text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)
CalcButton.displayName = "CalcButton"
