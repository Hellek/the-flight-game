import type { ReactNode } from 'react'

type HeadingLevel = 1 | 2 | 3 | 4

interface HeadingProps {
  level: HeadingLevel
  children: ReactNode
  className?: string
}

const levelClasses: Record<HeadingLevel, string> = {
  1: 'text-xl font-bold text-white',
  2: 'text-4xl font-bold',
  3: 'text-lg font-semibold text-slate-800',
  4: 'text-lg font-medium text-slate-800',
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4'

const levelTags: Record<HeadingLevel, HeadingTag> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
}

export const Heading = ({ level, children, className = '' }: HeadingProps) => {
  const Tag = levelTags[level]
  const baseClasses = levelClasses[level]
  return <Tag className={`${baseClasses} ${className}`.trim()}>{children}</Tag>
}
