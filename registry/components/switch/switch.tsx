/**
 * ptrckschrdtr-ds — Switch (React)
 *
 * Props:
 *   label — string  → renders a <label> next to the switch
 *   (plus all native <input type="checkbox"> props)
 *
 * Usage:
 *   import './switch.css'
 *   <Switch label="Enable notifications" />
 *   <Switch checked disabled />
 */

import * as React from 'react'

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, className, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const classes = ['switch', className].filter(Boolean).join(' ')

    const input = <input ref={ref} type="checkbox" role="switch" id={inputId} className={classes} {...props} />

    if (!label) return input

    return (
      <label className="switch-field" htmlFor={inputId}>
        {input}
        <span className="switch-field__label">{label}</span>
      </label>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch
