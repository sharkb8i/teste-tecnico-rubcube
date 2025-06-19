import React from "react";

interface StyledSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  label?: string;
}

const StyledSelect: React.FC<StyledSelectProps> = ({ options, label, ...props }) => {
  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium mb-1 text-white"
        >
          {label}
        </label>
      )}
      <select
        {...props}
        className="w-full bg-neutral-800 text-white border border-neutral-600 rounded px-3 py-2 appearance-none cursor-pointer"
      >
        {props.children
          ? props.children
          : options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-[50%] -translate-y-[-30%] text-white">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </div>
  );
};

export default StyledSelect;