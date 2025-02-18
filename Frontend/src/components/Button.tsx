import React from "react";

type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
    size?: ButtonSize;
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
    small: "px-2 py-1 text-xs min-w-[70px] min-h-[28px]",
    medium: "px-4 py-2 text-base min-w-[110px] min-h-[44px]",
    large: "px-6 py-3 text-lg min-w-[120px] min-h-[48px]",
};

const Button: React.FC<ButtonProps> = ({ size = "medium", onClick, disabled = false, children }) => {
    return (
        <button
            className={`rounded-md font-medium transition duration-200 ${sizeClasses[size]
                } ${disabled
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;