/**
 * ptrckschrdtr-ds — Avatar (React)
 *
 * Props:
 *   type     — 'initials' | 'icon' | 'image'  (default: 'initials')
 *   src      — string  → image URL, used when type='image'
 *   alt      — string  → alt text for image
 *   initials — string  → shown when type='initials'
 *   size     — 'sm' | 'md'  (default: 'md')
 *
 * Usage:
 *   import './avatar.css'
 *   <Avatar type="initials" initials="PS" />
 *   <Avatar type="image" src="/me.jpg" alt="Patrick" />
 *   <Avatar type="icon" size="sm" />
 */

import * as React from 'react'

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  type?: 'initials' | 'icon' | 'image'
  src?: string
  alt?: string
  initials?: string
  size?: 'sm' | 'md'
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ type = 'initials', src, alt = '', initials, size = 'md', className, ...props }, ref) => {
    const classes = ['avatar', size === 'sm' && 'avatar--sm', className].filter(Boolean).join(' ')

    return (
      <span ref={ref} className={classes} {...props}>
        {type === 'image' && src && <img src={src} alt={alt} />}
        {type === 'icon' && (
          <svg className="avatar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
        {type === 'initials' && initials}
      </span>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar
