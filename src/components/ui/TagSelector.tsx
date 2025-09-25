import { useState, KeyboardEvent } from 'react'
import Badge, { BadgeGroup } from './Badge'
import Input from './Input'
import { PlusIcon } from '@heroicons/react/24/outline'

export interface TagSelectorProps {
  tags: string[]
  onChange: (tags: string[]) => void
  availableTags?: string[]
  placeholder?: string
  label?: string
  maxTags?: number
  className?: string
}

export default function TagSelector({
  tags,
  onChange,
  availableTags = [],
  placeholder = "Agregar tag...",
  label = "Tags",
  maxTags,
  className = ''
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Filter available tags to show only those not already selected
  const filteredSuggestions = availableTags.filter(tag =>
    !tags.includes(tag) &&
    tag.toLowerCase().includes(inputValue.toLowerCase())
  ).slice(0, 5)

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && (!maxTags || tags.length < maxTags)) {
      onChange([...tags, trimmedTag])
      setInputValue('')
      setShowSuggestions(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag if input is empty and backspace is pressed
      removeTag(tags[tags.length - 1])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setInputValue('')
    }
  }

  const handleInputFocus = () => {
    setShowSuggestions(availableTags.length > 0)
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 150)
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          {label}
          {maxTags && (
            <span className="text-gray-500 dark:text-gray-400 font-normal">
              {' '}({tags.length}/{maxTags})
            </span>
          )}
        </label>
      )}

      {/* Selected Tags */}
      {tags.length > 0 && (
        <BadgeGroup className="mb-3">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="blue"
              removable
              onRemove={() => removeTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </BadgeGroup>
      )}

      {/* Tag Input */}
      <div className="relative">
        <div className="flex">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={maxTags && tags.length >= maxTags ? `Máximo ${maxTags} tags` : placeholder}
            disabled={maxTags ? tags.length >= maxTags : false}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => addTag(inputValue)}
            disabled={!inputValue.trim() || (maxTags ? tags.length >= maxTags : false)}
            className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 py-1">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Presiona Enter para agregar un tag o selecciona de las sugerencias
      </p>
    </div>
  )
}