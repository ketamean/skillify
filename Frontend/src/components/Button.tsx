import React from "react";

type ButtonSize = "small" | "medium" | "large";
type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  small: "px-2 py-1 text-xs min-w-[70px] min-h-[28px]",
  medium: "px-3 py-2 text-base min-w-[90px] min-h-[44px]",
  large: "px-8 py-3 text-lg min-w-[110px] min-h-[48px]",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-vibrant-green text-deepteal hover:bg-vibrant-green/60 font-bold rounded-lg hover:cursor-pointer",
  secondary:
    "bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg hover:cursor-pointer",
  outline:
    "border border-gray-400 text-gray-700 hover:bg-gray-200 font-bold rounded-lg hover:cursor-pointer",
};

const Button: React.FC<ButtonProps> = ({
  size = "medium",
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
  children,
}) => {
  return (
    <button
      className={`rounded-md font-medium transition duration-200
        ${sizeClasses[size]}
        ${disabled ? "bg-gray-400 text-gray-700 cursor-not-allowed" : variantClasses[variant]}
        ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
