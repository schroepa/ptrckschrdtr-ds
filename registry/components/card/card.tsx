/**
 * ptrckschrdtr-ds — Card (React)
 *
 * Exports:
 *   Card          → outer container
 *   CardMedia     → full-bleed image area
 *   CardHeader    → header with optional border
 *   CardTitle     → heading inside header
 *   CardDescription → subtext inside header
 *   CardBody      → main content area
 *   CardFooter    → bottom action area
 *
 * Usage:
 *   import './card.css'
 *
 *   // Simple with props
 *   <Card title="Hello" description="Subtext">Body</Card>
 *
 *   // Full composition
 *   <Card variant="elevated" interactive>
 *     <CardMedia><img src="..." alt="..." /></CardMedia>
 *     <CardHeader bordered>
 *       <CardTitle>Title</CardTitle>
 *       <CardDescription>Description</CardDescription>
 *     </CardHeader>
 *     <CardBody>Content</CardBody>
 *     <CardFooter align="end">
 *       <Button>Action</Button>
 *     </CardFooter>
 *   </Card>
 */

import * as React from 'react'

/* ── Card ──────────────────────────────────────────────── */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'ghost' | 'elevated'
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  href?: string
  title?: string
  description?: string
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      size = 'md',
      interactive = false,
      href,
      title,
      description,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const classes = [
      'card',
      variant !== 'default' && `card--${variant}`,
      size !== 'md' && `card--${size}`,
      interactive && 'card--interactive',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const hasAutoHeader = title || description

    if (href) {
      return (
        <a href={href} className={classes}>
          {hasAutoHeader && (
            <div className="card__header">
              {title && <h3 className="card__title">{title}</h3>}
              {description && <p className="card__description">{description}</p>}
            </div>
          )}
          <div className="card__body">{children}</div>
        </a>
      )
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {hasAutoHeader && (
          <div className="card__header">
            {title && <h3 className="card__title">{title}</h3>}
            {description && <p className="card__description">{description}</p>}
          </div>
        )}
        {hasAutoHeader ? (
          <div className="card__body">{children}</div>
        ) : (
          children
        )}
      </div>
    )
  }
)
Card.displayName = 'Card'

/* ── CardMedia ─────────────────────────────────────────── */
export const CardMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={['card__media', className].filter(Boolean).join(' ')} {...props} />
))
CardMedia.displayName = 'CardMedia'

/* ── CardHeader ────────────────────────────────────────── */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean
}
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ bordered, className, ...props }, ref) => (
    <div
      ref={ref}
      className={[
        'card__header',
        bordered && 'card__header--bordered',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

/* ── CardTitle ─────────────────────────────────────────── */
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={['card__title', className].filter(Boolean).join(' ')} {...props} />
))
CardTitle.displayName = 'CardTitle'

/* ── CardDescription ───────────────────────────────────── */
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={['card__description', className].filter(Boolean).join(' ')} {...props} />
))
CardDescription.displayName = 'CardDescription'

/* ── CardBody ──────────────────────────────────────────── */
export const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={['card__body', className].filter(Boolean).join(' ')} {...props} />
))
CardBody.displayName = 'CardBody'

/* ── CardFooter ────────────────────────────────────────── */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end' | 'between'
}
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ align, className, ...props }, ref) => (
    <div
      ref={ref}
      className={[
        'card__footer',
        align === 'end' && 'card__footer--end',
        align === 'between' && 'card__footer--between',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export default Card
