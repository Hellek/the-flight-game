type SelectVariant = 'light' | 'dark'

interface SelectOption<T extends string = string> {
  value: T
  label: string
}

interface SelectProps<T extends string = string> {
  id?: string
  value: T
  onChange: (value: T) => void
  options: SelectOption<T>[]
  variant?: SelectVariant
  className?: string
  'aria-label'?: string
}

const variantClasses: Record<SelectVariant, string> = {
  light:
    'w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900',
  dark: 'w-full max-w-xs px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
}

export function Select<T extends string = string>({
  id,
  value,
  onChange,
  options,
  variant = 'light',
  className = '',
  'aria-label': ariaLabel,
}: SelectProps<T>) {
  return (
    <select
      id={id}
      value={value}
      onChange={e => onChange(e.target.value as T)}
      className={`${variantClasses[variant]} ${className}`.trim()}
      aria-label={ariaLabel}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
