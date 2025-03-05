import React from "react";

interface InputProps {
    type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    name?: string;
    className?: string;
}

const Input: React.FC<InputProps> = ({ 
    type = "text", 
    placeholder, 
    value, 
    onChange, 
    label, 
    name, 
    className = "" 
}) => {
    return (
        <div className="w-full">
            {label && <label className="block text-gray-700 font-semibold mb-1">{label}</label>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-vibrant-green outline-none text-gray-900 ${className}`}
            />
        </div>
    );
};

export default Input;