"use client";

import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectMultipleOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectMultipleProps {
  options: SelectMultipleOption[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const SelectMultiple = React.forwardRef<HTMLDivElement, SelectMultipleProps>(
  ({ options, value, onChange, placeholder = "Chọn...", className, disabled }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    const handleToggle = (optionValue: string | number) => {
      if (disabled) return;

      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];

      onChange(newValue);
    };

    const handleRemove = (optionValue: string | number, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(value.filter((v) => v !== optionValue));
    };

    const selectedOptions = options.filter((opt) => value.includes(opt.value));

    return (
      <div ref={containerRef} className={cn("relative", className)}>
        {/* Selected values display */}
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "flex h-auto min-h-[36px] w-full items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors",
            "focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500",
            disabled && "cursor-not-allowed opacity-50",
            !disabled && "cursor-pointer hover:border-gray-300"
          )}
        >
          <div className="flex flex-1 flex-wrap gap-1.5">
            {selectedOptions.length === 0 ? (
              <span className="text-gray-400">{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                >
                  {option.label}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemove(option.value, e)}
                      className="ml-1 rounded-full hover:bg-blue-100 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))
            )}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform",
              isOpen && "rotate-180"
            )}
            aria-hidden="true"
          />
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                Không có tùy chọn nào
              </div>
            ) : (
              <div className="p-1">
                {options.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleToggle(option.value)}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm transition-colors",
                        isSelected && "bg-blue-50 text-blue-700",
                        !isSelected && "hover:bg-gray-50",
                        option.disabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded border-2",
                          isSelected
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300"
                        )}
                      >
                        {isSelected && (
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

SelectMultiple.displayName = "SelectMultiple";

export { SelectMultiple };
