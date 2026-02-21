import type { ReactNode } from 'react';

interface CheckboxProps {
  checked: boolean
  onChange: () => void
  label?: ReactNode
  className?: string
  inputClassName?: string
  'aria-label'?: string
}

export const Checkbox = ({
  checked,
  onChange,
  label,
  className = '',
  inputClassName = '',
  'aria-label': ariaLabel,
}: CheckboxProps) => {
  const inputClasses = `w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ${inputClassName}`.trim();

  const wrapper = (
    <label className={`flex items-center space-x-2 cursor-pointer ${className}`.trim()}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={inputClasses}
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
      />
      {label != null && <span className="text-sm">{label}</span>}
    </label>
  );

  return wrapper;
};
