import {
  Pin,
  PinOff,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"

import EnrollmentStatus from "@/app/components/EnrollmentStatus"

function CourseList({ courses, toggleCourseSelection, toggleCoursePinned }) {
  return (
    <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
      {courses.length > 0 ? (
        courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => toggleCoursePinned(course.id)}
                >
                  {course.pinned ? (
                    <Pin className="h-4 w-4 text-red-500 fill-red-500" />
                  ) : (
                    <PinOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
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
                      <EnrollmentStatus course={course} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No courses found. Try adjusting your search.
        </div>
      )}
    </div>
  )
}

export default CourseList
