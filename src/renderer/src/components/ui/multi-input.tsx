import * as React from 'react'
import { Badge } from './badge'
import { Button } from './button'
import { Input } from './input'
import { X } from 'lucide-react'
import { cn } from '@renderer/lib/utils'

export interface MultiInputProps {
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  filterFn?: (val: string) => string
}

/**
 * Generic controlled / uncontrolled multi-input component.
 * Displays added strings as removable badges above an input field with an Add button.
 */
export function MultiInput({
  value: controlledValue,
  defaultValue = [],
  onChange,
  placeholder = 'Add new...',
  disabled = false,
  className,
  filterFn
}: MultiInputProps) {
  // internal array state if uncontrolled, or controlled from outside
  const [internalItems, setInternalItems] = React.useState<string[]>(defaultValue)
  const [inputValue, setInputValue] = React.useState('')

  // is button enabled derived from disabled and sanitized value
  const isButtonDisabled = disabled || !inputValue.trim()

  const isControlled = controlledValue !== undefined
  const items = isControlled ? controlledValue : internalItems

  // update the state based on controlled or uncontrolled
  const updateItems = (newItems: string[]) => {
    if (!isControlled) {
      setInternalItems(newItems)
    }
    onChange?.(newItems)
  }

  // add an item at the end run a optional filter function
  const handleAdd = () => {
    const text = inputValue.trim()
    // don't add duplicates
    if (text && !items.includes(text)) {
      updateItems([...items, text])
      setInputValue('')
    }
  }

  // function to remove the ele by index
  const handleRemove = (indexToRemove: number) => {
    updateItems(items.filter((_, i) => i !== indexToRemove))
  }

  // add on click of enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  // handle onchange of input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value

    // sanitize any invalid entries
    if (filterFn) {
      text = filterFn(text)
    }
    // set the value
    setInputValue(text)
  }

  return (
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      {/* Badges container */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 min-h-6">
          {items.map((item, index) => (
            <Badge
              key={`${item}-${index}`}
              variant="secondary"
              className="group gap-1.5 px-2 py-2 text-sm transition-all hover:bg-destructive/15 hover:text-destructive cursor-pointer select-none"
              onClick={() => !disabled && handleRemove(index)}
            >
              {item}
              <X className="size-3 opacity-90 group-hover:opacity-100 transition-opacity" />
            </Badge>
          ))}
        </div>
      )}

      {/* Input + Add button */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          disabled={disabled}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button"
          variant="outline"
          className={cn(
            isButtonDisabled ? 'disabled:pointer-events-auto disabled:cursor-not-allowed!' : '',
            'active:scale-95'
          )}
          disabled={isButtonDisabled}
          onClick={handleAdd}
        >
          Add
        </Button>
      </div>
    </div>
  )
}
