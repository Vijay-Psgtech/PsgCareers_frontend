import React from "react";
import clsx from "clsx";

export const Input = React.forwardRef(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={clsx(
          "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
