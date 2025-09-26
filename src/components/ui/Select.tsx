import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  multiple?: boolean;
  className?: string;
}

export default function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Selecciona una opción",
  label,
  error,
  disabled = false,
  multiple = false,
  className = "",
}: SelectProps) {
  const [selectedValue, setSelectedValue] = useState<string | number | (string | number)[]>(
    value || defaultValue || (multiple ? [] : "")
  );

  const handleChange = (newValue: string | number | (string | number)[]) => {
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue as string | number);
    }
  };

  const getSelectedOption = () => {
    if (multiple) {
      const selectedOptions = options.filter(
        option => Array.isArray(selectedValue) && selectedValue.includes(option.value)
      );
      return selectedOptions.length > 0
        ? selectedOptions.map(opt => opt.label).join(", ")
        : placeholder;
    }

    const selected = options.find(option => option.value === selectedValue);
    return selected ? selected.label : placeholder;
  };

  const isError = !!error;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">{label}</label>
      )}

      <Listbox
        value={selectedValue}
        onChange={handleChange}
        disabled={disabled}
        multiple={multiple}
      >
        <div className="relative">
          <ListboxButton
            className={`relative w-full cursor-default rounded-md py-2 pr-10 pl-3 text-left text-sm transition-colors focus:outline-2 focus:-outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              isError
                ? "bg-white text-red-900 ring-1 ring-red-300 ring-inset focus:ring-2 focus:ring-red-600 focus:ring-inset dark:bg-gray-800 dark:text-red-400 dark:ring-red-600"
                : "bg-white text-[var(--foreground)] ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600 focus:ring-inset dark:bg-gray-800 dark:ring-gray-600"
            }`}
          >
            <span
              className={`block truncate ${!selectedValue || (Array.isArray(selectedValue) && selectedValue.length === 0) ? "text-gray-500 dark:text-gray-400" : ""}`}
            >
              {getSelectedOption()}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                aria-hidden="true"
                className="size-5 text-gray-400 dark:text-gray-500"
              />
            </span>
          </ListboxButton>

          <ListboxOptions
            transition
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in data-[closed]:data-[leave]:opacity-0 sm:text-sm dark:bg-gray-800 dark:ring-white/10"
          >
            {options.map(option => (
              <ListboxOption
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[focus]:bg-indigo-600 data-[focus]:text-white dark:text-gray-100"
              >
                <div className="flex flex-col">
                  <span className="block truncate font-normal group-data-[selected]:font-semibold">
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-xs text-gray-500 group-data-[focus]:text-indigo-200 dark:text-gray-400">
                      {option.description}
                    </span>
                  )}
                </div>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                  <CheckIcon aria-hidden="true" className="size-5" />
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>

      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
