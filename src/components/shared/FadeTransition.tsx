import { useEffect, useState, type ReactNode } from 'react'

interface FadeTransitionProps {
  children: ReactNode
  triggerKey: string
}

export function FadeTransition({ children, triggerKey }: FadeTransitionProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
  }, [triggerKey])

  return (
    <div
      className="transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {children}
    </div>
  )
}
