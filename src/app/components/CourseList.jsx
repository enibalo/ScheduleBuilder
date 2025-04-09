import {
  Pin,
  PinOff,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"

import EnrollmentStatus from "@/app/components/EnrollmentStatus"
import { Collapsible } from "@/components/ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronDown } from 'lucide-react';
import { useState } from "react";

function CourseList({ courses, toggleCourseSelection, toggleCoursePinned, enrolledCourses, onDeleteCourse}) {
  const [isOpen, setIsOpen] = useState(new Array(courses.length).fill(false));


  return (
    <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
      {courses.length > 0 ? (
        courses.map((course, index) => {
          const courseTimings = getCourseOfferings(course["schedule" + course.currentWeek]);
          
          
          
          return (
          <Card key={course.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative px-2 grid grid-cols-[1fr_2em]">
                <div>
                <div className="flex items-center">
                  <div className="mr-4">
                    <Checkbox
                      checked={course.selected}
                      onCheckedChange={() => toggleCourseSelection(course.id)}
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-bold">{course.code}</h3>
                      <p className="text-sm text-muted-foreground">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.professor}</p>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground">Seats:</p>
                        <p className="font-medium">
                          {course.seats.available}/{course.seats.total}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Waitlist:</p>
                        <p className="font-medium">
                          {course.waitlist.count}/{course.waitlist.capacity}
                        </p>
                         
                      </div>
                      
                    </div>
                    <div className="flex items-center">
                      {/* Only show enrollment status for waitlisted/enrolled course */}
                      
                      <EnrollmentStatus course={course} enrolledCourses={enrolledCourses}/>
                    </div>
                  </div>
                </div>
                <Collapsible
                          open={isOpen[index]}
                          onOpenChange={(value) => { setIsOpen(isOpen.map((item, i)=>{
                            return (i == index ) ? value : item 
                          })

                          )}}
                          className="p-1 w-full pl-7"
                        >
                          <div className="flex justify-centre align-centre" >
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="xs">
                              <ChevronDown className="h-2 w-2" />
                              <span className="sr-only">Toggle</span>
                            </Button>
                          </CollapsibleTrigger>
                          <span className="text-xs">
                            Course Details
                          </span>
                          </div>
                          <CollapsibleContent className="text-sm">
                            <div className=" pl-2 flex items-baseline gap-4" style={{fontSize: "12px"}} >
                            <div>
                            <div className="font-bold text-sm " >LEC</div>
                            <div>{course.room}</div>
                            <div>{courseTimings[0][1]}</div>
                            </div>
                            {/* Tutorial or Lab Information */}
                            {courseTimings[1] &&
                            <div>
                            <div className="font-bold">{courseTimings[1][0]}</div>
                            <div>{course.tutorialRoom}</div>
                            <div>{courseTimings[1][1]}</div>
                          </div>
                        }
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  </div>
                  <div className="flex flex-col justify-between w-full">
                      <Button
                        variant="ghost"
                        size="icon"
                        className=""
                        onClick={() => toggleCoursePinned(course.id)}
                      >
                        {course.pinned ? (
                          <Pin className="h-4 w-4 text-red-500 fill-red-500" />
                        ) : (
                          <PinOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                      variant="ghost"
                      size="icon"
                      className=""
                      value={course.id}
                      onClick={(e)=> onDeleteCourse(e.target.value)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" ></Trash2>
                      </Button>
                      </div>
    
                </div>
              </CardContent>
            </Card>
          )
        })
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No courses found. Add some to your schedule by the <br />search bar or suggested courses.
        </div>
      )}
    </div>
  )
}


function getCourseOfferings(schedule) {
  // Map of day indices to day names
  const daysMap = {
    0: "M", // Monday
    1: "T", // Tuesday
    2: "W", // Wednesday
    3: "TR", // Thursday
    4: "F"  // Friday
  };

  // Group schedule items by type (LEC, TUT, LAB)
  const groupedByType = schedule.reduce((acc, item) => {
    const dayName = daysMap[item.day];
    const startHour = item.startHour;
    const endHour = item.startHour + item.duration;

    // Format time (e.g., "10AM TO 11AM")
    const formatTime = (hour) => {
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour > 12 ? hour - 12 : hour;
      return `${formattedHour}${period}`;
    };

    const timeRange = `${formatTime(startHour)} TO ${formatTime(endHour)}`;

    if (!acc[item.type]) {
      acc[item.type] = { days: [], timeRange };
    }

    acc[item.type].days.push(dayName);
    return acc;
  }, {});

  // Convert grouped data into text format
  return Object.entries(groupedByType)
    .map(([type, data]) => {
      const daysText = data.days.join(""); // Combine days (e.g., "MWF")
      return [type, `${daysText} ${data.timeRange}`];
    });
}


// Output: LEC - MW 10AM TO 11AM, TUT - F 11AM TO 12PM


export default CourseList
