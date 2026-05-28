/**
 * ptrckschrdtr-ds — Select (React)
 *
 * Props:
 *   label    — string
 *   hint     — string  → helper or error text below select
 *   variant  — 'default' | 'error' | 'success'  (default: 'default')
 *   size     — 'sm' | 'md' | 'lg'               (default: 'md')
 *   multiple — boolean  → renders listbox mode
 *   required — boolean  → adds * to label
 *   disabled — boolean
 *   name     — string
 *   id       — string  → auto-generated if not provided
 *
 * Usage:
 *   import './select.css'
 *   <Select label="Country" hint="Select your country.">
 *     <option value="">Choose…</option>
 *     <option value="de">Germany</option>
 *   </Select>
 *   <Select label="Tags" multiple>
 *     <option value="a">Alpha</option>
 *     <option value="b">Beta</option>
 *   </Select>
 */

import * as React from 'react'

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  hint?: string
  variant?: 'default' | 'error' | 'success'
  size?: 'sm' | 'md' | 'lg'
  multiple?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      variant = 'default',
      size = 'md',
      multiple = false,
      required,
      className,
      id: propId,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const id = propId ?? generatedId

    const wrapperClasses = [
      'select-field',
      variant !== 'default' && `select-field--${variant}`,
      size !== 'md' && `select-field--${size}`,
      multiple && 'select-field--multiple',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={wrapperClasses}>
        {label && (
          <label
            htmlFor={id}
            className={[
              'select-field__label',
              required && 'select-field__label--required',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {label}
          </label>
        )}

        <div className="select-field__control">
          <select
            ref={ref}
            id={id}
            className="select-field__select"
            multiple={multiple}
            required={required}
            {...props}
          >
            {children}
          </select>
        </div>

        {hint && <span className="select-field__hint">{hint}</span>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
