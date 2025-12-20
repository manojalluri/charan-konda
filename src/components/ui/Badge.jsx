import { cn } from '../../lib/utils';

export const Badge = ({ children, variant = 'success', className, ...props }) => {
    const variants = {
        success: 'badge-success',
        warning: 'badge-warning',
        info: 'badge-info'
    };

    return (
        <span
            className={cn(variants[variant], className)}
            {...props}
        >
            {children}
        </span>
    );
};
