"use client"

import { useState, useEffect } from "react"

export function AppHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full bg-red-600 transition-shadow ${scrolled ? "shadow-md" : ""}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          <div className="flex items-center">
            <img
              src="https://portal.my.ucalgary.ca/myUofC/images/UC-White-horz-StartSomething-rgb300.png"
              alt="University of Calgary"
              className="h-8 md:h-10"
            />
          </div>
        </div>
      </div>
    </header>
  )
}