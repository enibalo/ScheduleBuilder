"use client"

import { ChevronLeft, ChevronRight, Pin, PinOff } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Schedule Preview Component
 * @param {Object} props
 * @param {number} props.weekNumber - Current week number
 * @param {number} props.totalWeeks - Total number of weeks
 * @param {Function} props.onPrevWeek - Function to go to previous week
 * @param {Function} props.onNextWeek - Function to go to next week
 * @param {Array} props.courses - Array of course blocks to display
 * @param {Array} [props.dates] - Array of date strings for the week
 * @param {number} [props.scheduleNumber] - Schedule number (1 or 2)
 * @param {Function} [props.onTogglePin] - Function to toggle pin status
 * @param {Function} [props.onSaveSchedule] - Function to save the schedule
 * @param {Function} [props.onGetSchedule] - Function to get the schedule
 */
export function SchedulePreview({
  weekNumber,
  totalWeeks,
  onPrevWeek,
  onNextWeek,
  courses = [],
  dates = ["Jan 10", "Jan 11", "Jan 12", "Jan 13", "Jan 14"], // Default dates if none provided
  scheduleNumber = 1,
  onTogglePin = () => {},
  onSaveSchedule = () => {},
  onGetSchedule = () => {},
}) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const hours = Array.from({ length: 10 }, (_, i) => i + 8) // 8am to 5pm

  const colors = {
    yellow: "bg-yellow-100 border-yellow-200 text-yellow-900",
    pink: "bg-pink-100 border-pink-200 text-pink-900",
    green: "bg-green-100 border-green-200 text-green-900",
    blue: "bg-blue-100 border-blue-200 text-blue-900",
    purple: "bg-purple-100 border-purple-200 text-purple-900",
    orange: "bg-orange-100 border-orange-200 text-orange-900",
  }

  return (
    <div className="w-full bg-white rounded-lg border shadow-sm">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Schedule {scheduleNumber} Preview</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onPrevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              {weekNumber} of {totalWeeks}
            </span>
            <Button variant="outline" size="icon" onClick={onNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-5 gap-px bg-border">
          {days.map((day, i) => (
            <div key={day} className="bg-background p-2 text-center">
              <div className="font-medium text-sm">{day}</div>
              <div className="text-xs text-muted-foreground">{dates[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Body */}
      <div className="relative p-4">
        <div className="relative bg-border rounded-lg overflow-hidden">
          {/* Time slots */}
          <div className="absolute -left-14 top-0 bottom-0 w-12 flex flex-col justify-between py-[10px] text-xs text-muted-foreground">
            {hours.map((hour) => (
              <div key={hour} className="text-right">{`${hour}:00`}</div>
            ))}
          </div>

          {/* Grid cells */}
          <div className="grid grid-cols-5 min-h-[600px]">
            {Array.from({ length: 5 }, (_, dayIndex) => (
              <div key={dayIndex} className="relative bg-background border-r last:border-r-0">
                {/* Hour lines */}
                {hours.map((hour) => (
                  <div key={hour} className="absolute w-full h-px bg-border" style={{ top: `${(hour - 8) * 60}px` }} />
                ))}
              </div>
            ))}
          </div>

          {/* Course blocks */}
          {courses.map((course, index) => {
            // Calculate position
            const left = `${course.day * 20}%` // 20% width for each day column
            const top = `${(course.startHour - 8) * 60}px` // 60px per hour
            const height = `${course.duration * 60}px`
            const width = "calc(20% - 2px)" // 20% width minus a small gap

            return (
              <div
                key={`${course.code}-${index}`}
                className={`absolute border rounded-md p-1 ${colors[course.color]} group`}
                style={{
                  left,
                  top,
                  height,
                  width,
                  margin: "1px",
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-medium">{course.code}</div>
                    <div className="text-xs">{course.type}</div>
                  </div>
                  <button className="transition-colors" onClick={() => onTogglePin(course.courseId)}>
                    {course.isPinned ? (
                      <Pin className="h-3 w-3 text-red-500 fill-red-500" />
                    ) : (
                      <PinOff className="h-3 w-3 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            )
          })}

          {/* Empty state - moved inside the calendar body */}
          {courses.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-background/50">
              <div className="text-center text-muted-foreground p-4">
                <p>No courses selected</p>
                <p className="text-sm">Select courses from the list to see them in your schedule</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onGetSchedule}>
            Get Schedule
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={onSaveSchedule}>
            Save Schedule
          </Button>
        </div>
      </div>
    </div>
  )
}