import { useState, ReactNode } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Label } from '@headlessui/react'
import { PaperClipIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Button from './Button'


export interface FormAction {
  label: string
  value: string | number
  icon?: ReactNode
  avatar?: string
}

export interface FormBuilderProps {
  titlePlaceholder?: string
  descriptionPlaceholder?: string
  titleValue?: string
  descriptionValue?: string
  onTitleChange?: (value: string) => void
  onDescriptionChange?: (value: string) => void
  actions?: {
    label: string
    options: FormAction[]
    value?: FormAction
    onChange?: (action: FormAction) => void
    icon?: ReactNode
  }[]
  onSubmit?: (data: { title: string; description: string; actions: Record<string, FormAction> }) => void
  submitLabel?: string
  className?: string
  showAttachment?: boolean
  onAttachment?: () => void
}

function classNames(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export default function FormBuilder({
  titlePlaceholder = "Título",
  descriptionPlaceholder = "Escribe una descripción...",
  titleValue = '',
  descriptionValue = '',
  onTitleChange,
  onDescriptionChange,
  actions = [],
  onSubmit,
  submitLabel = "Crear",
  className = '',
  showAttachment = true,
  onAttachment
}: FormBuilderProps) {
  const [title, setTitle] = useState(titleValue)
  const [description, setDescription] = useState(descriptionValue)
  const [selectedActions, setSelectedActions] = useState<Record<string, FormAction>>({})

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    onTitleChange?.(e.target.value)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
    onDescriptionChange?.(e.target.value)
  }

  const handleActionChange = (actionKey: string, selectedAction: FormAction) => {
    setSelectedActions(prev => ({
      ...prev,
      [actionKey]: selectedAction
    }))

    const action = actions.find(a => a.label === actionKey)
    action?.onChange?.(selectedAction)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({
      title,
      description,
      actions: selectedActions
    })
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="rounded-lg bg-white/80 dark:bg-gray-800/50 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 shadow-sm backdrop-blur-sm">
        <label htmlFor="title" className="sr-only">
          {titlePlaceholder}
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder={titlePlaceholder}
          value={title}
          onChange={handleTitleChange}
          className="block w-full bg-transparent px-3 pt-2.5 text-lg font-medium text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline focus:outline-0"
        />

        <label htmlFor="description" className="sr-only">
          {descriptionPlaceholder}
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder={descriptionPlaceholder}
          value={description}
          onChange={handleDescriptionChange}
          className="block w-full bg-transparent resize-none px-3 py-1.5 text-base text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
        />

        {/* Spacer element to match the height of the toolbar */}
        <div aria-hidden="true">
          <div className="py-2">
            <div className="h-9" />
          </div>
          <div className="h-px" />
          <div className="py-2">
            <div className="py-px">
              <div className="h-9" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-px bottom-0">
        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-nowrap justify-end space-x-2 px-2 py-2 sm:px-3">
            {actions.map((action) => {
              const selectedAction = selectedActions[action.label] || action.options[0]

              return (
                <Listbox
                  key={action.label}
                  as="div"
                  value={selectedAction}
                  onChange={(value: FormAction) => handleActionChange(action.label, value)}
                  className="shrink-0"
                >
                  <Label className="sr-only">{action.label}</Label>
                  <div className="relative">
                    <ListboxButton className="relative inline-flex items-center whitespace-nowrap rounded-full bg-white/10 dark:bg-white/5 px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/10 transition-colors sm:px-3">
                      {selectedAction?.avatar ? (
                        <Image
                          alt=""
                          src={selectedAction.avatar}
                          width={20}
                          height={20}
                          className="size-5 shrink-0 rounded-full"
                        />
                      ) : action.icon ? (
                        <span className="size-5 shrink-0 sm:-ml-1">
                          {action.icon}
                        </span>
                      ) : null}

                      <span
                        className={classNames(
                          selectedAction?.value !== null ? 'text-gray-900 dark:text-white' : '',
                          'hidden truncate sm:ml-2 sm:block',
                        )}
                      >
                        {selectedAction?.value !== null ? selectedAction.label : action.label}
                      </span>
                    </ListboxButton>

                    <ListboxOptions
                      transition
                      className="absolute right-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white dark:bg-gray-800 py-3 text-base outline outline-1 -outline-offset-1 outline-gray-200 dark:outline-white/10 shadow-lg data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                    >
                      {action.options.map((option) => (
                        <ListboxOption
                          key={option.value}
                          value={option}
                          className="cursor-default select-none px-3 py-2 data-[focus]:relative data-[focus]:bg-gray-100 dark:data-[focus]:bg-white/5 data-[focus]:hover:outline-none transition-colors"
                        >
                          <div className="flex items-center">
                            {option.avatar ? (
                              <Image
                                alt=""
                                src={option.avatar}
                                width={20}
                                height={20}
                                className="size-5 shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 outline outline-1 -outline-offset-1 outline-gray-200 dark:outline-white/10"
                              />
                            ) : option.icon ? (
                              <span className="size-5 shrink-0 text-gray-500 dark:text-gray-400">
                                {option.icon}
                              </span>
                            ) : null}

                            <span className="ml-3 block truncate font-medium text-gray-900 dark:text-white">
                              {option.label}
                            </span>
                          </div>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              )
            })}
          </div>
        )}

        <div className="flex items-center justify-between space-x-3 border-t border-gray-200 dark:border-white/10 px-2 py-2 sm:px-3">
          <div className="flex">
            {showAttachment && (
              <button
                type="button"
                onClick={onAttachment}
                className="group -my-2 -ml-2 inline-flex items-center rounded-full px-3 py-2 text-left text-gray-500 dark:text-gray-400 hover:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                <PaperClipIcon aria-hidden="true" className="-ml-1 mr-2 size-5 group-hover:text-gray-400 dark:group-hover:text-gray-300" />
                <span className="text-sm italic text-gray-500 dark:text-gray-400 group-hover:text-gray-400 dark:group-hover:text-gray-300">
                  Adjuntar archivo
                </span>
              </button>
            )}
          </div>
          <div className="shrink-0">
            <Button
              type="submit"
              variant="primary"
              disabled={!title.trim() || !description.trim()}
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}