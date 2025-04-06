"use client"

import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Check,
  ChevronDown,
  UserPlus,
  UserMinus,
  Clock,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"


function EnrollmentStatus({ course, enrollmentStatus, handleAction }) {
  const getCourseEnrollmentStatus = (courseId) => {
    return enrollmentStatus[courseId] || "not-enrolled"
  }

  const status = getCourseEnrollmentStatus(course.id);

  const handleEnroll = (courseId) => {
    handleAction(courseId, "enroll");
  };
  const handleWaitlist = (courseId) => {
    handleAction(courseId, "waitlist");
  };
  const handleDrop = (courseId) => {
    handleAction(courseId, "drop");
  };

  let badgeContent = null

  if (status === "enrolled") {
    badgeContent = (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
        <Check className="h-3 w-3" /> Enrolled
      </Badge>
    )
  } else if (status === "waitlisted") {
    badgeContent = (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
        <Clock className="h-3 w-3" /> Waitlisted
      </Badge>
    )
  } else if (course.status === "not-found") {
    return (
      <div className="flex items-center text-amber-500">
        <AlertTriangle className="h-4 w-4 mr-1" />
        <span className="text-sm">Not found in schedule</span>
      </div>
    )
  } else {
    badgeContent = (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
        Not Enrolled
      </Badge>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
          <div className="flex items-center gap-1">
            {badgeContent}
            <ChevronDown className="h-3 w-3 ml-1" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status !== "enrolled" && course.seats.available > 0 && (
          <DropdownMenuItem onClick={() => handleEnroll(course.id)}>
            <UserPlus className="h-4 w-4 mr-2" />
            <span>Enroll</span>
          </DropdownMenuItem>
        )}

        {status !== "waitlisted" &&
          course.seats.available === 0 &&
          course.waitlist.count < course.waitlist.capacity && (
            <DropdownMenuItem onClick={() => handleWaitlist(course.id)}>
              <Clock className="h-4 w-4 mr-2" />
              <span>Join Waitlist</span>
            </DropdownMenuItem>
          )}

        {(status === "enrolled" || status === "waitlisted") && (
          <>
            {status === "enrolled" && course.seats.available === 0 && (
              <DropdownMenuItem onClick={() => handleWaitlist(course.id)}>
                <Clock className="h-4 w-4 mr-2" />
                <span>Move to Waitlist</span>
              </DropdownMenuItem>
            )}

            {status === "waitlisted" && course.seats.available > 0 && (
              <DropdownMenuItem onClick={() => handleEnroll(course.id)}>
                <UserPlus className="h-4 w-4 mr-2" />
                <span>Move to Enrolled</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => handleDrop(course.id)}
              className="text-destructive focus:text-destructive"
            >
              <UserMinus className="h-4 w-4 mr-2" />
              <span>Drop Course</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )

}

export default EnrollmentStatus
