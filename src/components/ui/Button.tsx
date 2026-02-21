import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
  ghost:
    'flex items-center space-x-2 text-white hover:text-blue-300 transition-colors',
  icon: 'p-1 hover:bg-slate-200 rounded-full transition-colors',
};

export const Button = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const base = variant === 'primary' ? '' : 'bg-transparent border-0 cursor-pointer';
  return (
    <button
      className={`${base} ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};
