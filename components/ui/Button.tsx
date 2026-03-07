import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-bold smooth-transition focus:outline-none focus:ring-2 focus:ring-taxi-yellow focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            // Primary - Solid yellow with depth
            'bg-taxi-yellow text-taxi-black hover:bg-yellow-400 depth-3 hover-scale shadow-lg hover:shadow-2xl':
              variant === 'primary',

            // Secondary - Glass effect with border
            'glass-strong backdrop-blur-xl border-2 border-taxi-yellow text-taxi-yellow hover:bg-taxi-yellow hover:text-taxi-black hover-lift depth-2':
              variant === 'secondary',

            // Ghost - Minimal style
            'bg-transparent text-taxi-grey hover:bg-taxi-light-grey hover:text-taxi-black':
              variant === 'ghost',

            // Glass - Full glass morphism
            'glass backdrop-blur-xl border border-white/30 text-white hover:glass-strong hover-lift depth-2':
              variant === 'glass',

            // Outline - Simple outline
            'bg-transparent border-2 border-current hover:bg-current hover:text-white smooth-transition':
              variant === 'outline',

            // Sizes
            'text-sm px-4 py-2 rounded-lg': size === 'sm',
            'text-base px-6 py-3 md:px-8 md:py-4': size === 'md',
            'text-lg px-8 py-4 md:px-10 md:py-5 rounded-2xl': size === 'lg',
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
