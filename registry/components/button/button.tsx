/**
 * ptrckschrdtr-ds — Button (React)
 *
 * Props:
 *   variant  — 'primary' | 'secondary' | 'ghost' | 'danger'  (default: 'primary')
 *   size     — 'sm' | 'md' | 'lg'                            (default: 'md')
 *   href     — string  → renders as <a>, otherwise <button>
 *   loading  — boolean
 *   full     — boolean  → full width
 *   icon     — boolean  → icon-only (square, no label padding)
 *
 * Usage:
 *   import './button.css'
 *   <Button variant="secondary" size="lg">Click me</Button>
 *   <Button href="/about">Link button</Button>
 */

import * as React from 'react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  loading?: boolean
  full?: boolean
  icon?: boolean
}

const Spinner = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{
      animation: 'btn-spin 0.7s linear infinite',
      transformOrigin: 'center',
    }}
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="28"
      strokeDashoffset="10"
    />
  </svg>
)

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      href,
      loading = false,
      full = false,
      icon = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const classes = [
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      icon    && 'btn--icon',
      full    && 'btn--full',
      loading && 'btn--loading',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    if (href) {
      return (
        <a
          href={href}
          className={classes}
          aria-disabled={disabled || loading ? 'true' : undefined}
        >
          {loading && <Spinner />}
          {children}
        </a>
      )
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-disabled={disabled || loading ? 'true' : undefined}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
