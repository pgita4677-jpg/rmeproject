import React from "react";

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
        focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${className}`}
      {...props}
    />
  );
}
