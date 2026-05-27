/**
 * ptrckschrdtr-ds — Input (React)
 *
 * Props:
 *   label    — string
 *   hint     — string  → helper or error text below input
 *   variant  — 'default' | 'error' | 'success'  (default: 'default')
 *   size     — 'sm' | 'md' | 'lg'               (default: 'md')
 *   textarea — boolean  → renders <textarea> instead of <input>
 *   required — boolean  → adds * to label
 *
 * Usage:
 *   import './input.css'
 *   <Input label="Email" type="email" hint="We'll never share your email." />
 *   <Input label="Message" textarea hint="Max 500 characters." />
 *   <Input label="Username" variant="error" hint="Username already taken." />
 */

import * as React from 'react'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  hint?: string
  variant?: 'default' | 'error' | 'success'
  size?: 'sm' | 'md' | 'lg'
  textarea?: boolean
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  variant?: 'default' | 'error' | 'success'
  size?: 'sm' | 'md' | 'lg'
  textarea: true
}

let idCounter = 0

export const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps | TextareaProps
>(
  (
    {
      label,
      hint,
      variant = 'default',
      size = 'md',
      textarea = false,
      required,
      className,
      id: propId,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const id = propId ?? generatedId

    const wrapperClasses = [
      'input-field',
      variant !== 'default' && `input-field--${variant}`,
      size !== 'md' && `input-field--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const inputClasses = [
      'input-field__input',
      textarea && 'input-field__input--textarea',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={wrapperClasses}>
        {label && (
          <label
            htmlFor={id}
            className={[
              'input-field__label',
              required && 'input-field__label--required',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {label}
          </label>
        )}

        {textarea ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={id}
            className={inputClasses}
            required={required}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={id}
            className={inputClasses}
            required={required}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {hint && <span className="input-field__hint">{hint}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
