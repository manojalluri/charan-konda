import { cn } from '../../lib/utils';

export const Input = ({ className, ...props }) => {
    return (
        <input
            className={cn('input', className)}
            {...props}
        />
    );
};
