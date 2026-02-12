import PropTypes from 'prop-types';

export default function Card({
    children,
    variant = 'default',
    className = '',
    onClick,
    ...props
}) {
    const variants = {
        default: 'card',
        hover: 'card-hover',
        interactive: 'card-interactive',
        glass: 'glass rounded-xl p-6',
    };

    const variantClass = variants[variant] || variants.default;

    return (
        <div
            className={`${variantClass} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
}

Card.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['default', 'hover', 'interactive', 'glass']),
    className: PropTypes.string,
    onClick: PropTypes.func,
};
