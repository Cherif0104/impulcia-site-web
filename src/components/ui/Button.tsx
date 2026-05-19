import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  className?: string;
  onClick?: () => void;
};

const variants = {
  primary:
    'bg-brand-accent text-brand-navy hover:bg-brand-accent-hover shadow-glow font-semibold',
  secondary:
    'bg-transparent border border-brand-border text-white hover:border-brand-accent hover:text-brand-accent',
  ghost: 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
};

const sizes = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-lg transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
