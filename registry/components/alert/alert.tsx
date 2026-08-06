/**
 * ptrckschrdtr-ds — Alert (React)
 *
 * Props:
 *   variant     — 'default' | 'destructive'  (default: 'default')
 *   title       — string
 *   description — string  → optional, or use children
 *
 * Icon is bound to variant, not a free prop — see the Astro version's
 * header comment for the reasoning.
 *
 * Usage:
 *   import './alert.css'
 *   <Alert title="Heads up">Something to know.</Alert>
 *   <Alert variant="destructive" title="Error" description="Something broke." />
 */

import * as React from 'react'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive'
  title: string
  description?: string
}

const InfoIcon = () => (
  <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
)

const TriangleAlertIcon = () => (
  <svg className="alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
)

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'default', title, description, className, children, ...props }, ref) => {
    const classes = ['alert', variant === 'destructive' && 'alert--destructive', className].filter(Boolean).join(' ')

    return (
      <div ref={ref} className={classes} role="alert" {...props}>
        {variant === 'destructive' ? <TriangleAlertIcon /> : <InfoIcon />}
        <div className="alert__content">
          <div className="alert__title">{title}</div>
          {description ? <div className="alert__description">{description}</div> : children}
        </div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export default Alert
