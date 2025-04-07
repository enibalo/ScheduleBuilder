"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SearchBar({ courses, onSelect }) {
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");
  const filteredCourses =  courses.filter((item) => item.toLowerCase().includes(search.toLowerCase()))

  
  return (
    <>
    
      {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
       //I coudln't get it to work and we had other stuff to do so...
       */}
      <Input
        placeholder="Search courses..."
        className="rounded-b-none focus-visible:border-input focus-visible:ring-0 focus-visible:shadow-none"  //"pl-10"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
      />
      {isFocused && (
        <ScrollArea className="absolute bg-white z-10 h-72 w-48 border w-full border-input rounded-b max-h-[150px]">
          <div className="p-4">
            {
            filteredCourses.length != 0 ? 
            filteredCourses
              .map((item, index) => (
                <button type="button" value={item} onClick={(e) => onSelect(e.target.value)} key={item + "-" + "button" + "-" + index} className=" text-left w-full block text-sm border-b-2 border-input py-2">
                    {item} 
                </button>
              )) :
                <div key={"no-courses"}className="text-center py-8 text-black">
                  No courses found. Try adjusting your search.
                </div>}
          </div>
        </ScrollArea>
      )}
    </>
  );
}


