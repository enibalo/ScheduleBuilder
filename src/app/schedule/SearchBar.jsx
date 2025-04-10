"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Collapsible } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';

export default function SearchBar({ courses, onSelect, filters }) {
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");
  const filteredCourses = courses.filter((course) => {
    let searchMatch =
      course.code.toLowerCase().includes(search.toLowerCase()) ||
      course.professor.toLowerCase().includes(search.toLowerCase());
    let filterMatch = true;

    const MORNING_CUTOFF = 12; //12/4/7
    const AFTERNOON_CUTOFF = 16; // Corrected to 2 PM (24-hour format)

    if (
      filters.morningClasses == true ||
      filters.afternoonClasses == true ||
      filters.eveningClasses == true
    ) {
      let timeMatch = false;
      //morning
      if (filters.morningClasses) {
        timeMatch = timeMatch || course.schedule1[0].startHour < MORNING_CUTOFF || course.schedule2[0].startHour < MORNING_CUTOFF;
      }

      //afternoon
      if (filters.afternoonClasses) {
        timeMatch =
          timeMatch ||
          (course.schedule1[0].startHour >= MORNING_CUTOFF &&
            course.schedule1[0].startHour < AFTERNOON_CUTOFF) ||
          (course.schedule2[0].startHour >= MORNING_CUTOFF &&
            course.schedule2[0].startHour < AFTERNOON_CUTOFF);
      }

      //evening
      if (filters.eveningClasses) {
        timeMatch =
          timeMatch || course.schedule1[0].startHour >= AFTERNOON_CUTOFF ||
          course.schedule2[0].startHour >= AFTERNOON_CUTOFF;
      }
      filterMatch = filterMatch && timeMatch;
    }

    if (filters.requiredClasses == true) {
      filterMatch = filterMatch && course.requiredClasses;
    }

    if (filters.onlineClasses == true) {
      filterMatch = filterMatch && course.onlineClasses;
    }

    if (filters.fullClasses == true) {
      filterMatch =
        filterMatch &&
        (course.seats.taken == course.seats.total &&
          course.waitlist.count === course.waitlist.capacity) == false; // Classes that are full
    }

    if (filters.waitlistedClasses == true) {
      filterMatch = filterMatch && course.seats.taken == course.seats.total  // Classes with students on the waitlist
    }

    return searchMatch && filterMatch;
  });

  return (
    <>
      {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      
       */}
      <Input
        placeholder="Search courses..."
        className="rounded-b-none focus-visible:border-input focus-visible:ring-0 focus-visible:shadow-none" //"pl-10"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => { setIsFocused(false) }, 200)}
      />
      {isFocused && (
        <div className="absolute z-10 w-full">
          <ScrollArea className="bg-white z-10 h-72 w-48 border w-full border-input rounded-b max-h-[150px]">
            <div className="p-4 pt-0">
              {filteredCourses.length != 0 ? (
                filteredCourses.map((course, index) => (
                  <button
                    type="button"
                    value={course.id}
                    onClick={() => { onSelect(course.id) }}
                    key={course + "-" + "searchbar" + "-" + index}
                    className=" p-1 text-left w-full block text-sm border-b-2 border-input py-2 hover:bg-slate-100"
                  >
                    <h3 className="font-bold">{course.code}</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.professor}
                    </p>
                  </button>

                ))
              ) : (
                <div key={"no-courses"} className="text-center py-8 text-black">
                  No courses found. Try adjusting your search.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
      <SearchBottom filters={Object.entries(filters)}></SearchBottom>
    </>
  );
}


function SearchBottom({ filters }) {
  const [isOpen, setIsOpen] = useState(false);
  const onFilters = filters.filter((filter) =>
    filter[1] == true
  )


  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })
  };


  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="p-1 w-full  text-muted-foreground"
    >
      <div className="flex justify-centre align-centre" >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="xs">
            <ChevronDown className="h-2 w-2" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
        <div className="flex gap-5 items-baseline" styles={styles.upperLeft}>
          <span className="text-xs">
            Current Filters ({onFilters.length})
          </span>
          <a className="text-xs p-1 underline" onClick={scrollToBottom}>Suggested Courses</a>
        </div>
      </div>
      <CollapsibleContent>
        {onFilters.length != 0 ? onFilters.map((filter) =>
        (
          <Badge variant="outline" key={"current-" + filter[0]}>{filter[0]}</Badge>
        )
        ) : <div className="text-xs no-bg">You have not selected any filters.</div>}
      </CollapsibleContent>
    </Collapsible>
  );
}

export { SearchBottom };

const styles = {
  upperLeft: {
    // position: "absolute",
    // zIndex: "2",
    // // left: "-15px",
    // // top: "5px",
    backgroundColor: "rgb(241 243 248)",
  },
};
