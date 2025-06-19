"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

interface SearchBarProps {
  placeholder?: string
}

export function SearchBar({ placeholder = "Search..." }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  return (
      <motion.div
          className="relative w-full"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div
            className={`relative flex items-center transition-all duration-300 ${
                isFocused ? "ring-2 ring-blue-500/50" : ""
            }`}
        >
          <div className="absolute left-4 z-10">
            <Search
                className={`w-5 h-5 transition-colors duration-200 ${isFocused ? "text-blue-400" : "text-slate-400"}`}
            />
          </div>

          <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Search suggestions dropdown would go here */}
        {searchValue && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl p-2 z-20"
            >
              <div className="text-sm text-slate-300 p-2">Search suggestions would appear here...</div>
            </motion.div>
        )}
      </motion.div>
  )
}
