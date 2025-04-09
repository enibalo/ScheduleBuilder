import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import EnrollmentStatus from "./EnrollmentStatus"


const colors = {
  "blue": "bg-blue-100 border-blue-200 text-blue-800",
  "green": "bg-green-100 border-green-200 text-green-800",
  "yellow": "bg-yellow-100 border-yellow-200 text-yellow-800",
  "pink": "bg-pink-100 border-pink-200 text-pink-800",
  "purple": "bg-purple-100 border-purple-200 text-purple-800",
}

function GetScheduleDialog({ open, courses, onConfirm, onCancel }) {
  const pendingActions = [];


  function courseAction(course) {
    if (course.status === "enrolled") {
      return (
        <>
          <div className="text-lg font-bold text-gray-600">{course.code} - None</div>
          <div className="text-sm text-gray-500">Already Enrolled</div>
        </>
      )
    }
    if (course.status === "waitlisted") {
      if (course.seats.available < course.seats.total) {
        return (
          <>
            <div className="text-lg font-bold text-green-600">{course.code} - Enroll</div>
          </>
        )
      }
      return (
        <>
          <div className="text-lg font-bold text-gray-600">{course.code} - None</div>
          <div className="text-sm text-gray-500">Already Waitlisted</div>
        </>
      )
    }
    if (course.status === "none") {
      if (course.seats.available < course.seats.total) {
        return (
          <>
            <div className="text-lg font-bold text-green-600">{course.code} - Enroll</div>
          </>
        )
      }
      return (
        <>
          <div className="text-lg font-bold text-yellow-600">{course.code} - Waitlist</div>
          <div className="text-sm text-gray-500">Class is full</div>
        </>
      )
    }
    // return (
    //   <>
    //     <div className="text-lg font-bold text-red-600">Drop</div>
    //     <div className="text-sm text-gray-500"></div>
    //   </>
    // )
  }

  if (courses.length == 0){
    return (<Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className=" p-0 overflow-hidden">
        <div className="flex h-full">
          <div className="flex-1 p-6 max-h-[600px] overflow-y-auto">
            <DialogTitle className="">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Confirm Actions</h2>
                <div className="text-sm font-normal pt-3">Please add at least one course to your schedule before attempting to enroll.</div>
                <div className="text-sm font-normal pt-3"> <strong>TIP:</strong> If you're not sure what courses to enroll in check your <a className="underline" href="https://example.com/">
          Academic Requirements Report
        </a>.</div>
              </div>
            </DialogTitle>
          </div>
        </div>
      </DialogContent>
    </Dialog>)
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <div className="flex h-full">
          <div className="flex-1 p-6 max-h-[600px] overflow-y-auto">
            <DialogTitle>
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Confirm Actions</h2>
                <p className="text-sm text-gray-500">Review the following changes to your schedule</p>
              </div>
            </DialogTitle>
            <div className="space-y-4">
              {courses.map((course, index) => {
                // Find the course details to get the color
                const color = colors[course?.color] || "bg-gray-100 border-gray-200 text-gray-800";

                return (
                  <div key={index} className={`p-3 rounded-md border ${color} flex justify-between items-center`}>
                    <span className="font-medium">{course.code}</span>
                    <span className="font-medium">Seats: {course.seats.available}/{course.seats.total}</span>
                    <span className="font-medium">Waiting: {course.waitlist.count}/{course.waitlist.capacity}</span>
                    <div className="text-xs text-gray-600 mt-1">
                      <EnrollmentStatus course={course} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right side - Summary and Buttons */}
          <div className="w-[220px] bg-gray-50 border-l p-6 flex flex-col">
            <h3 className="font-medium mb-6">Summary</h3>

            <div className="flex-1">
              {courses.map((course, index) => {
                return <div className="text-center" key={index}>
                  {courseAction(course)}
                </div>
              })}
            </div>

            <div className="mt-auto space-y-3">
              <Button variant="outline" className="w-full" onClick={onCancel}>
                Cancel
              </Button>
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white" onClick={onConfirm}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GetScheduleDialog
