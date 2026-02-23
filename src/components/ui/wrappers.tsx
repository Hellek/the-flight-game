import type { ReactNode } from 'react';
import { cn } from '@ui';
import { Button as ShadcnButton } from './Button';
import { Checkbox as ShadcnCheckbox } from './Checkbox';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';

/* Button: старый API (primary | ghost | icon) → shadcn */
type ButtonVariant = 'primary' | 'ghost' | 'icon';

interface ButtonWrapperProps
  extends Omit<React.ComponentProps<typeof ShadcnButton>, 'variant' | 'size'> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variantMap = {
  primary: { variant: 'default' as const, size: 'default' as const },
  ghost: { variant: 'ghost' as const, size: 'default' as const },
  icon: { variant: 'ghost' as const, size: 'icon' as const },
};

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonWrapperProps) {
  const { variant: v, size } = variantMap[variant];
  return (
    <ShadcnButton variant={v} size={size} className={className} {...props}>
      {children}
    </ShadcnButton>
  );
}

/* Checkbox: старый API (checked, onChange, label?) → shadcn */
interface CheckboxWrapperProps {
  checked: boolean;
  onChange: () => void;
  label?: ReactNode;
  className?: string;
  inputClassName?: string;
  'aria-label'?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  className = '',
  inputClassName = '',
  'aria-label': ariaLabel,
}: CheckboxWrapperProps) {
  return (
    <label
      className={cn('flex cursor-pointer items-center gap-2', className)}
    >
      <ShadcnCheckbox
        checked={checked}
        onCheckedChange={onChange}
        className={inputClassName}
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
      />
      {label != null && <span className="text-sm">{label}</span>}
    </label>
  );
}

/* Select: старый API (value, onChange, options, variant?) → shadcn compound */
type SelectVariant = 'light' | 'dark';

interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface SelectWrapperProps<T extends string = string> {
  id?: string;
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  variant?: SelectVariant;
  className?: string;
  'aria-label'?: string;
}

const selectVariantClasses: Record<SelectVariant, string> = {
  light: 'bg-background text-foreground border-input',
  dark: 'max-w-xs bg-muted border-input text-foreground',
};

export function Select<T extends string = string>({
  id,
  value,
  onChange,
  options,
  variant = 'light',
  className = '',
  'aria-label': ariaLabel,
}: SelectWrapperProps<T>) {
  return (
    <ShadcnSelect value={value} onValueChange={v => onChange(v as T)}>
      <SelectTrigger
        id={id}
        aria-label={ariaLabel}
        className={cn(selectVariantClasses[variant], className)}
      >
        <SelectValue placeholder="Выберите..." />
      </SelectTrigger>
      <SelectContent>
        {options.map(opt => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </ShadcnSelect>
  );
}
