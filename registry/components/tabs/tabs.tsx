/**
 * ptrckschrdtr-ds — Tabs (React)
 *
 * Props:
 *   items      — { id: string, label: string }[]
 *   defaultTab — string  → id of the initially active tab (default: items[0].id)
 *   children   — one element per tab, each with a data-tab-panel prop
 *                matching an item id
 *
 * Usage:
 *   <Tabs items={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]}>
 *     <div data-tab-panel="a">Panel A</div>
 *     <div data-tab-panel="b">Panel B</div>
 *   </Tabs>
 */

import * as React from 'react'

export interface TabItem {
  id: string
  label: string
}

export interface TabsProps {
  items: TabItem[]
  defaultTab?: string
  children: React.ReactNode
  className?: string
}

export function Tabs({ items, defaultTab, children, className }: TabsProps) {
  const [active, setActive] = React.useState(defaultTab ?? items[0]?.id)
  const groupId = React.useId()

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setActive(items[(index + 1) % items.length].id)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setActive(items[(index - 1 + items.length) % items.length].id)
    }
  }

  return (
    <div className={['tabs', className].filter(Boolean).join(' ')}>
      <div className="tabs-list" role="tablist">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="tabs-trigger"
            id={`${groupId}-tab-${item.id}`}
            role="tab"
            aria-selected={item.id === active}
            aria-controls={`${groupId}-panel-${item.id}`}
            tabIndex={item.id === active ? 0 : -1}
            onClick={() => setActive(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        const panelId = (child.props as { 'data-tab-panel'?: string })['data-tab-panel']
        if (!panelId) return child
        return panelId === active ? child : null
      })}
    </div>
  )
}

export default Tabs
