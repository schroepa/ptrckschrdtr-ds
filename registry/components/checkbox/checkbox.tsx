/**
 * ptrckschrdtr-ds — Checkbox (React)
 *
 * Props:
 *   label — string  → renders a <label> next to the checkbox
 *   (plus all native <input type="checkbox"> props)
 *
 * Usage:
 *   import './checkbox.css'
 *   <Checkbox label="Accept terms" />
 *   <Checkbox checked disabled />
 */

import * as React from 'react'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const classes = ['checkbox', className].filter(Boolean).join(' ')

    const input = <input ref={ref} type="checkbox" id={inputId} className={classes} {...props} />

    if (!label) return input

    return (
      <label className="checkbox-field" htmlFor={inputId}>
        {input}
        <span className="checkbox-field__label">{label}</span>
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
