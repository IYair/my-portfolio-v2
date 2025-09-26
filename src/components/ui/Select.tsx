import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
}

export interface SelectProps {
  options: SelectOption[]
  value?: string | number
  defaultValue?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  multiple?: boolean
  className?: string
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
  className = ''
}: SelectProps) {
  const [selectedValue, setSelectedValue] = useState<string | number | (string | number)[]>(
    value || defaultValue || (multiple ? [] : '')
  )

  const handleChange = (newValue: string | number | (string | number)[]) => {
    setSelectedValue(newValue)
    if (onChange) {
      onChange(newValue as string | number)
    }
  }

  const getSelectedOption = () => {
    if (multiple) {
      const selectedOptions = options.filter(option =>
        Array.isArray(selectedValue) && selectedValue.includes(option.value)
      )
      return selectedOptions.length > 0
        ? selectedOptions.map(opt => opt.label).join(', ')
        : placeholder
    }

    const selected = options.find(option => option.value === selectedValue)
    return selected ? selected.label : placeholder
  }

  const isError = !!error

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          {label}
        </label>
      )}

      <Listbox
        value={selectedValue}
        onChange={handleChange}
        disabled={disabled}
        multiple={multiple}
      >
        <div className="relative">
          <ListboxButton
            className={`relative w-full cursor-default rounded-md py-2 pl-3 pr-10 text-left text-sm transition-colors focus:outline-2 focus:-outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              isError
                ? 'bg-white dark:bg-gray-900 text-red-900 dark:text-red-100 ring-1 ring-inset ring-red-300 dark:ring-red-600 focus:ring-2 focus:ring-inset focus:ring-red-600 dark:focus:ring-red-400'
                : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400'
            }`}
          >
            <span className={`block truncate ${!selectedValue || (Array.isArray(selectedValue) && selectedValue.length === 0) ? 'text-gray-500 dark:text-gray-400' : ''}`}>
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
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
          >
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 dark:text-gray-100 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              >
                <div className="flex flex-col">
                  <span className="block truncate font-normal group-data-[selected]:font-semibold">
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 group-data-[focus]:text-indigo-200">
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

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}