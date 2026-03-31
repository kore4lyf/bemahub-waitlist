"use client"

import * as React from "react"
import { defaultCountries, parseCountry } from "react-international-phone"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown, Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  name?: string
}

export interface PhoneInputHandle {
  validate: () => Promise<{ valid: boolean; error?: string }>
  getNumber: () => string
}

const getFlagUrl = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`

interface CountryData {
  name: string
  iso2: string
  dialCode: string
}

const countries: CountryData[] = defaultCountries.map((c) => {
  const parsed = parseCountry(c)
  return {
    name: parsed.name,
    iso2: parsed.iso2,
    dialCode: parsed.dialCode,
  }
}).sort((a, b) => a.name.localeCompare(b.name))

const defaultCountry = countries.find(c => c.iso2 === "ng") || countries[0]

const formatPhoneNumber = (phone: string, countryIso2: string): string => {
  // Remove + prefix if present
  const cleanPhone = phone.replace(/^\+/, "")
  
  try {
    const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance()
    const phoneNumberFormat = require("google-libphonenumber").PhoneNumberFormat
    // Use uppercase country code for region
    const regionCode = countryIso2.toUpperCase()
    const parsed = phoneUtil.parseAndKeepRawInput(cleanPhone, regionCode)
    if (phoneUtil.isValidNumber(parsed)) {
      return phoneUtil.format(parsed, phoneNumberFormat.E164)
    }
  } catch (e) {
    // Fall through
  }
  // If library fails, just add + prefix
  return `+${cleanPhone}`
}

export const PhoneInput = React.forwardRef<PhoneInputHandle, PhoneInputProps>(
  ({ value, onChange, placeholder = "Enter phone number", name }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const [localInput, setLocalInput] = React.useState("")
    const [isValid, setIsValid] = React.useState(true)

    const currentCountry = React.useMemo(() => {
      if (value) {
        const matched = countries.find(c => value.startsWith(c.dialCode) || value.startsWith(`+${c.dialCode}`))
        return matched || defaultCountry
      }
      return defaultCountry
    }, [value])

    React.useEffect(() => {
      if (value) {
        const matched = countries.find(c => value.startsWith(c.dialCode) || value.startsWith(`+${c.dialCode}`))
        if (matched) {
          // Extract local number - remove + prefix and dial code, library handles the rest
          const withoutCode = value.replace(/^\+/, "").slice(matched.dialCode.length)
          setLocalInput(withoutCode)
          
          // Validate the phone
          const formatted = formatPhoneNumber(value, matched.iso2)
          setIsValid(formatted.startsWith("+"))
        }
      } else {
        setLocalInput("")
        setIsValid(true)
      }
    }, [value])

    const handleCountrySelect = (country: CountryData) => {
      setIsOpen(false)
      setSearch("")
      setLocalInput("")
      setIsValid(true)
      onChange("")
    }

    const filteredCountries = countries.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dialCode.includes(search) ||
        c.iso2.toLowerCase().includes(search.toLowerCase())
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(/\D/g, "")
      setLocalInput(input)
      
      // Build full phone - library handles trunk prefix conversion automatically
      const fullPhone = `${currentCountry.dialCode}${input}`
      const formatted = formatPhoneNumber(fullPhone, currentCountry.iso2)
      
      onChange(formatted)
      setIsValid(true)
    }

    const validate = async (): Promise<{ valid: boolean; error?: string }> => {
      // Validate local input length first
      if (!localInput || localInput.length < 7) {
        setIsValid(false)
        return { valid: false, error: "Please enter a valid phone number (7+ digits)" }
      }
      
      // Get phone value - library handles trunk prefix conversion automatically
      const phoneValue = value || `${currentCountry.dialCode}${localInput}`
      // Remove + prefix if present for validation
      const phoneForValidation = phoneValue.replace(/^\+/, "")

      try {
        const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance()
        const phoneNumberFormat = require("google-libphonenumber").PhoneNumberFormat
        // Use uppercase country code for region
        const regionCode = currentCountry.iso2.toUpperCase()
        const parsed = phoneUtil.parseAndKeepRawInput(phoneForValidation, regionCode)
        
        if (!phoneUtil.isValidNumber(parsed)) {
          setIsValid(false)
          return { valid: false, error: "Invalid phone number format" }
        }
        
        // Get the properly formatted number with + using E164 format
        const formatted = phoneUtil.format(parsed, phoneNumberFormat.E164)
        onChange(formatted)
        setIsValid(true)
        return { valid: true }
      } catch (e) {
        setIsValid(false)
        return { valid: false, error: "Invalid phone number format" }
      }
    }

    React.useImperativeHandle(ref, () => ({
      validate,
      getNumber: () => {
        if (!value && localInput) {
          return formatPhoneNumber(`${currentCountry.dialCode}${localInput}`, currentCountry.iso2)
        }
        return value
      }
    }))

    return (
      <div className="flex w-full mb-5 gap-0">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "dial-code-btn flex items-center gap-1.5 px-4 py-3 rounded-l-[6px] h-[48px] transition-all duration-200",
                isOpen ? "ring-2 ring-[#d9724d]" : "focus:ring-2 focus:ring-[#d9724d]"
              )}
            >
              <img src={getFlagUrl(currentCountry.iso2)} alt={currentCountry.iso2} className="w-5 h-3.5 object-cover rounded-sm" />
              <span className="text-base font-bold text-[#2d4a44] whitespace-nowrap">+{currentCountry.dialCode}</span>
              <ChevronDown className="w-3 h-3 text-[#9ca3af]" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0 bg-white rounded-sm shadow-lg border border-[#d1d5db] overflow-hidden" align="start">
            <div className="p-3 border-b border-[#e5e7eb] bg-[#f9fafb]">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4b5563]" />
                <Input
                  placeholder="Search country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 py-2.5 text-sm bg-white border border-[#d1d5db] hover:border-[#d9724d] focus:border-[#d9724d] focus:ring-2 focus:ring-[#d9724d]/20 focus:outline-none rounded-md placeholder:text-[#4b5563] transition-colors shadow-none"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {filteredCountries.map((c) => (
                <button
                  key={c.iso2}
                  type="button"
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-[#f3f4f6] transition-colors",
                    currentCountry.iso2 === c.iso2 && "bg-[#fef7f4]"
                  )}
                  onClick={() => handleCountrySelect(c)}
                >
                  <img src={getFlagUrl(c.iso2)} alt={c.iso2} className="w-7 h-5 object-cover rounded-sm" />
                  <span className="flex-1 text-sm font-medium text-[#374151]">{c.name}</span>
                  <span className="text-sm font-medium text-[#2d4a44]">+{c.dialCode}</span>
                  {currentCountry.iso2 === c.iso2 && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <div className="p-4 text-center text-[#9ca3af] text-sm">
                  No country found
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        <input
          type="tel"
          name={name}
          value={localInput}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={cn(
            "flex-1 px-4 py-3 mb-0 bg-white rounded-l-none rounded-r-[6px] text-base font-normal text-[#2d4a44] placeholder:text-[#9ca3af] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d9724d]/20 h-[48px] border border-gray-300 border-l-0",
            !isValid && "border-red-500 focus:border-red-500"
          )}
        />
      </div>
    )
  }
)

PhoneInput.displayName = "PhoneInput"