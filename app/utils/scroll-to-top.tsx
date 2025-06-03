"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0)

    // Alternative method to scroll to a specific element if it exists
    const topElement = document.getElementById("top")
    if (topElement) {
      topElement.scrollIntoView({ behavior: "auto" })
    }
  }, [pathname])

  return null
}

