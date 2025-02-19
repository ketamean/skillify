import React from "react";

type TextInputProps = {
  type?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  label?: string;
  name: string;
};

const TextInput: React.FC<TextInputProps> = ({
  type = "text",
  label,
  placeholder,
  onChange,
  name,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label className="text-gray-700 font-medium" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default TextInput;
