"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AmountInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: number
  onChange?: (value: number | undefined) => void
  currency?: string
  locale?: string
  label?: string
  error?: string
  min?: number
  max?: number
}

export function AmountInput({
  value,
  onChange,
  currency = "ARS",
  locale = "es-AR", // Changed default to Argentine locale
  label,
  error,
  className,
  min = 0,
  max,
  disabled,
  placeholder = "0,00", // Changed placeholder to use comma for decimals
  ...props
}: AmountInputProps) {
  const [displayValue, setDisplayValue] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)

  // Format number to currency display
  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat(locale, {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  // Get currency symbol
  const getCurrencySymbol = (): string => {
    return (
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value || "$"
    )
  }

  // Update display when value changes externally
  React.useEffect(() => {
    if (!isFocused && value !== undefined) {
      setDisplayValue(formatCurrency(value))
    }
  }, [value, isFocused])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value

    // Allow empty input
    if (input === "") {
      setDisplayValue("")
      onChange?.(undefined)
      return
    }

    // Remove all non-numeric characters except comma and dot
    const cleaned = input.replace(/[^\d.,]/g, "")

    // Replace comma with dot for parsing
    const normalized = cleaned.replace(",", ".")

    // Prevent multiple decimal points
    const parts = normalized.split(".")
    if (parts.length > 2) return

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) return

    setDisplayValue(cleaned)

    // Convert to number and notify parent
    const numValue = Number.parseFloat(normalized)
    if (!isNaN(numValue)) {
      // Apply min/max constraints
      if (min !== undefined && numValue < min) return
      if (max !== undefined && numValue > max) return

      onChange?.(numValue)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    // Show raw number when focused
    if (value !== undefined) {
      setDisplayValue(value.toString())
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Format on blur
    if (value !== undefined) {
      setDisplayValue(formatCurrency(value))
    }
  }

  return (
    <div className="space-y-1 ">
      {label && (
        <label
          htmlFor={props.id}
          className={cn(
            "block text-sm font-medium mb-2",
            error && "text-destructive"
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {getCurrencySymbol()}
        </span>
        <Input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={cn("pl-8 h-10", error && "border-destructive focus-visible:ring-destructive", className)}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
