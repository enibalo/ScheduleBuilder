"use client"

import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Check,
  ChevronDown,
  UserPlus,
  UserMinus,
  Clock,
  CheckCircle,
  Ban,
} from "lucide-react"


function EnrollmentStatus({ course, weekNumber, enrolledCourses }) {
  const courseKey = "" + course.id + "-" + weekNumber + "";
 

  if ( enrolledCourses == {} || Object.keys(enrolledCourses).includes(courseKey) == false ){
    if (course.seats.available != 0) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <UserPlus className="h-3 w-3" /> Enroll
        </Badge>
      )
    } else if (course.waitlist.count != 0) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
          <Clock className="h-3 w-3" /> Waitlist
        </Badge>
      )
    }
    else{
      return (<Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
      <Ban className="h-3 w-3" /> No More Seats
    </Badge>)
    }
  }
  else{
    return (
      <Badge>
        <CheckCircle className="h-3 w-3" /> {enrolledCourses[courseKey]}
      </Badge>
    )
  }
}

export default EnrollmentStatus
