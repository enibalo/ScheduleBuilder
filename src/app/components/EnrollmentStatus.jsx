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


function EnrollmentStatus({ course }) {
  if (course.seats.available < course.seats.total) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
        <UserPlus className="h-3 w-3" /> Enroll
      </Badge>
    )
  } else if (course.seats.available >= course.seats.total) {
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
        <Clock className="h-3 w-3" /> Waitlist
      </Badge>
    )
  }

  return (
    <></>
  )
}

export default EnrollmentStatus
