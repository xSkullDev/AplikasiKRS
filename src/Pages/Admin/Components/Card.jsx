const Card = ({ children, className = "", ...props }) => {
    return (
        <div className={`w-full bg-white rounded-2xl shadow-lg p-8 ${className}`.trim()} {...props}>
            {children}
        </div>
    );
};

export default Card;