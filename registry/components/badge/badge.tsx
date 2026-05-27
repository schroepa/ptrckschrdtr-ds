/**
 * ptrckschrdtr-ds — Badge (React)
 *
 * Props:
 *   variant  — 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
 *   badgeStyle — 'solid' | 'subtle' | 'outline'  (default: 'solid')
 *   size     — 'sm' | 'md' | 'lg'                (default: 'md')
 *   dot      — boolean  → shows a colored dot before the label
 *
 * Note: prop is named `badgeStyle` (not `style`) to avoid conflict
 * with React's built-in `style` prop for inline styles.
 *
 * Usage:
 *   import './badge.css'
 *   <Badge variant="success" badgeStyle="subtle" dot>Active</Badge>
 *   <Badge variant="error">Failed</Badge>
 *   <Badge variant="primary" badgeStyle="outline" size="sm">New</Badge>
 */

import * as React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  badgeStyle?: 'solid' | 'subtle' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      badgeStyle = 'solid',
      size = 'md',
      dot = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const classes = [
      'badge',
      `badge--${variant}`,
      badgeStyle !== 'solid' && `badge--${badgeStyle}`,
      size !== 'md' && `badge--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <span ref={ref} className={classes} {...props}>
        {dot && <span className="badge__dot" aria-hidden="true" />}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
