import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold';

type BaseProps = {
  variant?: Variant;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children?: ReactNode;
};

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-500 text-background-50 hover:bg-primary-600 active:bg-primary-700 disabled:bg-[#BBAACC] disabled:opacity-60',
  secondary:
    'bg-transparent text-primary-500 border-2 border-primary-500 hover:bg-background-100 hover:border-primary-600 active:bg-background-200 active:border-primary-700',
  ghost:
    'bg-transparent text-secondary-500 border border-secondary-500 hover:bg-secondary-500/10 hover:text-secondary-600 active:bg-secondary-500/20 active:text-primary-500',
  gold:
    'bg-accent-500 text-primary-500 hover:bg-accent-600 active:bg-accent-700 disabled:opacity-60',
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-heading font-bold text-[14px] leading-[22px] px-6 py-3 rounded-[5px] whitespace-nowrap transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed';

export const Button = forwardRef<HTMLButtonElement, BaseProps & ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ variant = 'primary', iconLeft, iconRight, className = '', children, ...rest }, ref) => {
    return (
      <button ref={ref} className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...rest}>
        {iconLeft}
        {children}
        {iconRight}
      </button>
    );
  }
);
Button.displayName = 'Button';

type LinkButtonProps = BaseProps & {
  to: string;
  external?: boolean;
};

export function LinkButton({
  variant = 'primary',
  iconLeft,
  iconRight,
  className = '',
  children,
  to,
  external,
}: LinkButtonProps) {
  const cls = `${baseClasses} ${variantClasses[variant]} ${className}`;
  if (external) {
    return (
      <a href={to} className={cls} target="_blank" rel="noopener noreferrer nofollow">
        {iconLeft}
        {children}
        {iconRight}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {iconLeft}
      {children}
      {iconRight}
    </Link>
  );
}