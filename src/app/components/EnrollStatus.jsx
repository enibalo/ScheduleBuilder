import { Badge } from "@/components/ui/badge"
import {
  UserPlus,
  Clock,
  CheckCircle,
  Ban,
} from "lucide-react"

function EnrollStatus({ course }) {
  if (course.status != "Enrolled" && course.status != "Waitlisted") {
    if (course.seats.taken < course.seats.total) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <UserPlus className="h-3 w-3" /> Enroll
        </Badge>
      )
    } else if (course.waitlist.count < course.waitlist.capacity) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
          <Clock className="h-3 w-3" /> Waitlist
        </Badge>
      )
    }
    else {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <Ban className="h-3 w-3" /> No More Seats
        </Badge>
      )
    }
  }
  else {
    return (
      <Badge>
        <CheckCircle className="h-3 w-3" /> {course.status}
      </Badge>
    )
  }
}

export default EnrollStatus
