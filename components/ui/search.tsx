"use client"

import type React from "react"

import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export function Search({ placeholder = "Buscar...", value, onChange, className = "" }: SearchProps) {
  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input type="search" placeholder={placeholder} className="pl-10" value={value} onChange={onChange} />
    </div>
  )
}

