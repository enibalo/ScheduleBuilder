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
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          <div className="flex w-full items-center justify-between">
            <img
              src="https://portal.my.ucalgary.ca/myUofC/images/UC-White-horz-StartSomething-rgb300.png"
              alt="University of Calgary"
              className="h-8 md:h-10"
            />
            {pathname.includes("schedule") &&
              <Link
              href="/"
              className="underline text-white font-bold"
            >
              <Home></Home>
            </Link>
            }
            
          </div>
        </div>
      </div>
    </header>
  );
}
