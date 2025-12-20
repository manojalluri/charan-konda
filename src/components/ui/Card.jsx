import { cn } from '../../lib/utils';

export const Card = ({ children, className, interactive = false, ...props }) => {
    return (
        <div
            className={cn(
                interactive ? 'card-interactive' : 'card',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
