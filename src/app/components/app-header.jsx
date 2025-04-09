"use client";

import { useState, useEffect } from "react";
import { Home } from 'lucide-react';
import { usePathname } from "next/navigation";

import Link from "next/link";

export function AppHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-red-600 transition-shadow ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-3">
        <div className="flex h-12 items-center"> {/* ↓ from h-16 to h-12 */}
          <div className="flex w-full items-center justify-between">
            <img
              src="https://portal.my.ucalgary.ca/myUofC/images/UC-White-horz-StartSomething-rgb300.png"
              alt="University of Calgary"
              className="h-6 md:h-8" // ↓ logo height
            />
            {pathname.includes("schedule") && (
              <Link
                href="/"
                className="text-white font-semibold text-sm underline flex items-center gap-1"
              >
                <Home className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
  
  
}
