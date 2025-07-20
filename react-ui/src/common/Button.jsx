import React from 'react';

export const Button = ({ variant = 'primary', className, ...props }) => {
    const baseStyles = 'py-2 px-4 rounded font-semibold border';
    const variantStyles =
        variant === 'primary'
            ? 'bg-black text-white hover:bg-gray-500'
            : 'bg-white text-black border-black hover:bg-gray-200';

    return <button className={`${baseStyles} ${variantStyles} ${className}`} {...props} />;
};