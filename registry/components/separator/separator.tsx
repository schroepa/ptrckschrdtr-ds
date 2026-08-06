/**
 * ptrckschrdtr-ds — Separator (React)
 *
 * Usage:
 *   import './separator.css'
 *   <Separator />
 */

import * as React from 'react'

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ className, ...props }, ref) => {
    const classes = ['separator', 'separator--horizontal', className].filter(Boolean).join(' ')
    return <hr ref={ref} className={classes} role="separator" {...props} />
  }
)

Separator.displayName = 'Separator'

export default Separator
