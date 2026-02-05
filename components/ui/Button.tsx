import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            // Variants
            'bg-taxi-yellow text-taxi-black hover:bg-yellow-400 focus:ring-taxi-yellow shadow-lg hover:shadow-xl':
              variant === 'primary',
            'bg-transparent border-2 border-taxi-yellow text-taxi-yellow hover:bg-taxi-yellow hover:text-taxi-black focus:ring-taxi-yellow':
              variant === 'secondary',
            'bg-transparent text-taxi-black hover:bg-taxi-light-grey focus:ring-taxi-grey':
              variant === 'ghost',

            // Sizes
            'text-sm px-4 py-2': size === 'sm',
            'text-base px-6 py-3 md:px-8 md:py-4': size === 'md',
            'text-lg px-8 py-4 md:px-10 md:py-5': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
