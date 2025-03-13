"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Search,
  Filter,
  AlertTriangle,
  Check,
  Pin,
  PinOff,
  ChevronDown,
  UserPlus,
  UserMinus,
  Clock,
  Info,
  Calendar,
  Copy,
  Trash2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SchedulePreview } from "./components/schedule-preview"
import { SavedSchedules } from "./components/saved-schedules"
import { EnrollmentConfirmation } from "./components/enrollment-confirmation"
import { FilterDialog } from "./components/filter-dialog"
import { AppHeader } from "./components/app-header"
import { SuccessDialog } from "./components/success-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CourseSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSchedule, setActiveSchedule] = useState(1)
  const [selectedCoursesSchedule1, setSelectedCoursesSchedule1] = useState([])
  const [selectedCoursesSchedule2, setSelectedCoursesSchedule2] = useState([])
  const [pinnedCoursesSchedule1, setPinnedCoursesSchedule1] = useState([])
  const [pinnedCoursesSchedule2, setPinnedCoursesSchedule2] = useState([])
  const [weekNumber, setWeekNumber] = useState(1)
  const [savedSchedules, setSavedSchedules] = useState([])
  const [savedSchedulesCollapsed, setSavedSchedulesCollapsed] = useState(true)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [scheduleName, setScheduleName] = useState("")
  const [enrollmentStatus, setEnrollmentStatus] = useState({})
  const [selectedTerm, setSelectedTerm] = useState("fall2024")
  const totalWeeks = 88

  // Add new state for tracking pending actions
  const [pendingActions, setPendingActions] = useState([])
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)

  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    allClasses: false,
    morningClasses: false,
    afternoonClasses: false,
    eveningClasses: false,
    requiredClasses: false,
    availableClasses: false,
    fullClasses: false,
    waitlistedClasses: false,
  })

  // Load saved schedules from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("savedSchedules")
    if (savedData) {
      try {
        setSavedSchedules(JSON.parse(savedData))
      } catch (e) {
        console.error("Failed to parse saved schedules", e)
      }
    }

    // Initialize enrollment status
    const savedEnrollmentStatus = localStorage.getItem("enrollmentStatus")
    if (savedEnrollmentStatus) {
      try {
        setEnrollmentStatus(JSON.parse(savedEnrollmentStatus))
      } catch (e) {
        console.error("Failed to parse enrollment status", e)
      }
    }
  }, [])

  // Save schedules to localStorage when they change
  useEffect(() => {
    localStorage.setItem("savedSchedules", JSON.stringify(savedSchedules))
  }, [savedSchedules])

  // Save enrollment status to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("enrollmentStatus", JSON.stringify(enrollmentStatus))
  }, [enrollmentStatus])

  // Calculate dates based on week number
  // Using January 10, 2024 (a Wednesday) as the base date for week 1
  const calculateDates = (weekNum) => {
    // Start with January 8, 2024 (a Monday) as the first day of week 1
    const baseDate = new Date(2024, 0, 8)

    // Add weeks to the base date
    const weekStartDate = new Date(baseDate)
    weekStartDate.setDate(baseDate.getDate() + (weekNum - 1) * 7)

    // Generate dates for Monday through Friday
    const dates = []
    for (let i = 0; i < 5; i++) {
      const date = new Date(weekStartDate)
      date.setDate(weekStartDate.getDate() + i)

      // Format as "Jan 10"
      const month = date.toLocaleString("en-US", { month: "short" })
      const day = date.getDate()
      dates.push(`${month} ${day}`)
    }

    return dates
  }

  const weekDates = calculateDates(weekNumber)

  // Sample course data for Schedule 1
  const coursesSchedule1 = [
    {
      id: "1",
      code: "BSOE 101",
      title: "Intro to Computer Science",
      seats: {
        available: 14,
        total: 101,
      },
      waitlist: {
        count: 0,
        capacity: 50,
      },
      status: "available",
      color: "blue",
      schedule: [
        {
          day: 0, // Monday
          startHour: 10,
          duration: 2,
          type: "LEC",
        },
        {
          day: 2, // Wednesday
          startHour: 10,
          duration: 1,
          type: "TUT",
        },
      ],
    },
    {
      id: "2",
      code: "BSOE 201",
      title: "Data Structures",
      seats: {
        available: 65,
        total: 99,
      },
      waitlist: {
        count: 0,
        capacity: 40,
      },
      status: "available",
      color: "green",
      schedule: [
        {
          day: 1, // Tuesday
          startHour: 13,
          duration: 1.5,
          type: "LEC",
        },
        {
          day: 3, // Thursday
          startHour: 13,
          duration: 1.5,
          type: "LEC",
        },
      ],
    },
    {
      id: "3",
      code: "BSOE 301",
      title: "Algorithms",
      seats: {
        available: 0,
        total: 60,
      },
      waitlist: {
        count: 15,
        capacity: 20,
      },
      status: "waitlist",
      color: "purple",
      schedule: [
        {
          day: 0, // Monday
          startHour: 14,
          duration: 1,
          type: "LEC",
        },
        {
          day: 2, // Wednesday
          startHour: 14,
          duration: 1,
          type: "LEC",
        },
        {
          day: 4, // Friday
          startHour: 9,
          duration: 2,
          type: "LAB",
        },
      ],
    },
    {
      id: "4",
      code: "CHEM 201",
      title: "Organic Chemistry",
      seats: {
        available: 0,
        total: 200,
      },
      waitlist: {
        count: 45,
        capacity: 45,
      },
      status: "not-found",
      color: "orange",
      schedule: [
        {
          day: 1, // Tuesday
          startHour: 9,
          duration: 1.5,
          type: "LEC",
        },
        {
          day: 3, // Thursday
          startHour: 9,
          duration: 1.5,
          type: "LEC",
        },
        {
          day: 4, // Friday
          startHour: 13,
          duration: 3,
          type: "LAB",
        },
      ],
    },
  ]

  // Sample course data for Schedule 2
  const coursesSchedule2 = [
    {
      id: "5",
      code: "PHYS 101",
      title: "Physics I: Mechanics",
      seats: {
        available: 25,
        total: 120,
      },
      waitlist: {
        count: 0,
        capacity: 30,
      },
      status: "available",
      color: "yellow",
      schedule: [
        {
          day: 0, // Monday
          startHour: 8,
          duration: 1.5,
          type: "LEC",
        },
        {
          day: 2, // Wednesday
          startHour: 8,
          duration: 1.5,
          type: "LEC",
        },
        {
          day: 4, // Friday
          startHour: 14,
          duration: 2,
          type: "LAB",
        },
      ],
    },
    {
      id: "6",
      code: "MATH 101",
      title: "Calculus I",
      seats: {
        available: 12,
        total: 150,
      },
      waitlist: {
        count: 5,
        capacity: 25,
      },
      status: "available",
      color: "pink",
      schedule: [
        {
          day: 1, // Tuesday
          startHour: 10,
          duration: 1.5,
          type: "LEC",
        },
        {
          day: 3, // Thursday
          startHour: 10,
          duration: 1.5,
          type: "LEC",
        },
      ],
    },
    {
      id: "7",
      code: "HIST 101",
      title: "World History",
      seats: {
        available: 0,
        total: 80,
      },
      waitlist: {
        count: 20,
        capacity: 20,
      },
      status: "waitlist",
      color: "green",
      schedule: [
        {
          day: 0, // Monday
          startHour: 13,
          duration: 1,
          type: "LEC",
        },
        {
          day: 2, // Wednesday
          startHour: 13,
          duration: 1,
          type: "LEC",
        },
        {
          day: 4, // Friday
          startHour: 11,
          duration: 1,
          type: "TUT",
        },
      ],
    },
    {
      id: "8",
      code: "ENGL 101",
      title: "Composition",
      seats: {
        available: 30,
        total: 100,
      },
      waitlist: {
        count: 0,
        capacity: 20,
      },
      status: "available",
      color: "blue",
      schedule: [
        {
          day: 1, // Tuesday
          startHour: 15,
          duration: 1.5,
          type: "LEC",
        },
        {
          day: 3, // Thursday
          startHour: 15,
          duration: 1.5,
          type: "LEC",
        },
      ],
    },
  ]

  // Get the active course list based on selected schedule
  const activeCourses = activeSchedule === 1 ? coursesSchedule1 : coursesSchedule2
  const selectedCourses = activeSchedule === 1 ? selectedCoursesSchedule1 : selectedCoursesSchedule2
  const setSelectedCourses = activeSchedule === 1 ? setSelectedCoursesSchedule1 : setSelectedCoursesSchedule2
  const pinnedCourses = activeSchedule === 1 ? pinnedCoursesSchedule1 : pinnedCoursesSchedule2
  const setPinnedCourses = activeSchedule === 1 ? setPinnedCoursesSchedule1 : setPinnedCoursesSchedule2

  // Convert selected courses to schedule blocks
  const selectedCourseBlocks = useMemo(() => {
    const blocks = []
    const courseMap = new Map(activeCourses.map((course) => [course.id, course]))

    for (const courseId of selectedCourses) {
      const course = courseMap.get(courseId)
      if (course) {
        course.schedule.forEach((scheduleItem, index) => {
          blocks.push({
            id: `${course.id}-${index}`,
            courseId: course.id,
            code: course.code,
            type: scheduleItem.type,
            day: scheduleItem.day,
            startHour: scheduleItem.startHour,
            duration: scheduleItem.duration,
            color: course.color,
            isPinned: pinnedCourses.includes(course.id),
          })
        })
      }
    }

    return blocks
  }, [activeCourses, selectedCourses, pinnedCourses])

  const filteredCourses = activeCourses.filter(
    (course) =>
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]))
  }

  const toggleCoursePinned = (courseId) => {
    setPinnedCourses((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]))
  }

  const saveCurrentSchedule = () => {
    if (!scheduleName.trim()) return

    // Get selected course details
    const selectedCourseDetails = selectedCourses.map((courseId) => {
      const course = activeCourses.find((c) => c.id === courseId)
      return {
        id: course.id,
        code: course.code,
        title: course.title,
        color: course.color,
      }
    })

    const newSchedule = {
      id: Date.now().toString(),
      name: scheduleName,
      scheduleNumber: activeSchedule,
      courses: selectedCourseDetails,
      pinnedCourses: [...pinnedCourses],
      savedAt: new Date().toISOString(),
    }

    setSavedSchedules((prev) => [newSchedule, ...prev])
    setScheduleName("")
    setSaveDialogOpen(false)
  }

  const loadSavedSchedule = (scheduleId) => {
    const schedule = savedSchedules.find((s) => s.id === scheduleId)
    if (!schedule) return

    // Set active schedule
    setActiveSchedule(schedule.scheduleNumber)

    // Set selected courses
    if (schedule.scheduleNumber === 1) {
      setSelectedCoursesSchedule1(schedule.courses.map((c) => c.id))
      setPinnedCoursesSchedule1(schedule.pinnedCourses || [])
    } else {
      setSelectedCoursesSchedule2(schedule.courses.map((c) => c.id))
      setPinnedCoursesSchedule2(schedule.pinnedCourses || [])
    }
  }

  const removeSavedSchedule = (scheduleId) => {
    setSavedSchedules((prev) => prev.filter((s) => s.id !== scheduleId))
  }

  // Enrollment status management
  const getCourseEnrollmentStatus = (courseId) => {
    return enrollmentStatus[courseId] || "not-enrolled"
  }

  const updateEnrollmentStatus = (courseId, status) => {
    setEnrollmentStatus((prev) => ({
      ...prev,
      [courseId]: status,
    }))
  }

  // Modify the enrollment action handlers to store pending actions instead of executing immediately
  const handleEnroll = (courseId) => {
    const course = activeCourses.find((c) => c.id === courseId)
    setPendingActions((prev) => [
      ...prev,
      {
        type: "enroll",
        courseId,
        courseName: course.code,
      },
    ])
  }

  const handleWaitlist = (courseId) => {
    const course = activeCourses.find((c) => c.id === courseId)
    setPendingActions((prev) => [
      ...prev,
      {
        type: "waitlist",
        courseId,
        courseName: course.code,
      },
    ])
  }

  const handleDrop = (courseId) => {
    const course = activeCourses.find((c) => c.id === courseId)
    setPendingActions((prev) => [
      ...prev,
      {
        type: "drop",
        courseId,
        courseName: course.code,
      },
    ])
  }

  // Add a new function to handle the "Get Schedule" button click
  const handleGetSchedule = () => {
    if (pendingActions.length > 0) {
      setConfirmationOpen(true)
    }
  }

  // Add confirmation handlers
  const handleConfirmActions = () => {
    pendingActions.forEach((action) => {
      switch (action.type) {
        case "enroll":
          updateEnrollmentStatus(action.courseId, "enrolled")
          if (!selectedCourses.includes(action.courseId)) {
            toggleCourseSelection(action.courseId)
          }
          break
        case "waitlist":
          updateEnrollmentStatus(action.courseId, "waitlisted")
          if (!selectedCourses.includes(action.courseId)) {
            toggleCourseSelection(action.courseId)
          }
          break
        case "drop":
          updateEnrollmentStatus(action.courseId, "not-enrolled")
          if (selectedCourses.includes(action.courseId)) {
            toggleCourseSelection(action.courseId)
          }
          break
      }
    })
    setConfirmationOpen(false)
    // Show success dialog after actions are completed
    setSuccessDialogOpen(true)
  }

  const handleCancelActions = () => {
    setPendingActions([])
    setConfirmationOpen(false)
  }

  const handleSaveFilters = () => {
    // Apply filters logic here
    setFilterDialogOpen(false)
  }

  // Render enrollment status badge
  const renderEnrollmentStatus = (course) => {
    const status = getCourseEnrollmentStatus(course.id)

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

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <div className="w-full max-w-[1400px] mx-auto p-4 pt-6 flex items-center min-h-[calc(100vh-4rem)]">
        <div className="grid lg:grid-cols-[1fr,600px] gap-12 w-full items-start">
          {/* Course Search Section */}
          <div>
            {/* Term selection and info icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium mr-2">Term:</span>
                </div>
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fall2024">Fall 2024</SelectItem>
                    <SelectItem value="winter2025">Winter 2025</SelectItem>
                    <SelectItem value="spring2025">Spring 2025</SelectItem>
                    <SelectItem value="summer2025">Summer 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <div className="relative cursor-pointer">
                      <div className="absolute -inset-0.5 rounded-full bg-red-200 animate-[pulse_2s_ease-in-out_infinite]"></div>
                      <Button variant="ghost" size="sm" className="relative z-10 h-7 w-7 p-0">
                        <Info className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-4" side="bottom">
                    <div className="space-y-2">
                      <p className="font-medium">How to select and enroll in courses:</p>
                      <ol className="space-y-1 list-decimal pl-4">
                        <li>Use the search box to find courses</li>
                        <li>Click the checkbox to add a course to your schedule</li>
                        <li>Pin important courses by clicking the pin icon</li>
                        <li>Click "Not Enrolled" to see enrollment options</li>
                        <li>Click "Get Schedule" to confirm your selections</li>
                      </ol>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => setFilterDialogOpen(true)}>
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <FilterDialog
                open={filterDialogOpen}
                onOpenChange={setFilterDialogOpen}
                filters={filters}
                onFiltersChange={setFilters}
                onSave={handleSaveFilters}
              />
            </div>

            <div className="mb-6">
              <div className="flex border-b">
                <div
                  className={`relative px-4 py-2 flex items-center cursor-pointer ${
                    activeSchedule === 1
                      ? "bg-background text-foreground border-l border-t border-r rounded-t-md -mb-px"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setActiveSchedule(1)}
                >
                  <span className="text-sm font-medium">Schedule 1</span>
                  {activeSchedule === 1 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />}
                </div>
                <div
                  className={`relative px-4 py-2 flex items-center cursor-pointer ${
                    activeSchedule === 2
                      ? "bg-background text-foreground border-l border-t border-r rounded-t-md -mb-px"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setActiveSchedule(2)}
                >
                  <span className="text-sm font-medium">Schedule 2</span>
                  {activeSchedule === 2 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />}
                </div>
                <div className="flex-1 border-b -mb-px"></div>
              </div>

              {/* Schedule action buttons - moved below the tab line */}
              <div className="flex justify-end items-center gap-2 mt-2 mb-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          // Copy current schedule logic
                          const newSchedule = [...selectedCourses]
                          const newPinnedCourses = [...pinnedCourses]
                          if (activeSchedule === 1) {
                            setSelectedCoursesSchedule2(newSchedule)
                            setPinnedCoursesSchedule2(newPinnedCourses)
                            setActiveSchedule(2)
                          } else {
                            setSelectedCoursesSchedule1(newSchedule)
                            setPinnedCoursesSchedule1(newPinnedCourses)
                            setActiveSchedule(1)
                          }
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create a copy of this schedule</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => {
                    // Clear current schedule logic
                    if (activeSchedule === 1) {
                      setSelectedCoursesSchedule1([])
                      setPinnedCoursesSchedule1([])
                    } else {
                      setSelectedCoursesSchedule2([])
                      setPinnedCoursesSchedule2([])
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative p-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => toggleCoursePinned(course.id)}
                        >
                          {pinnedCourses.includes(course.id) ? (
                            <Pin className="h-4 w-4 text-red-500 fill-red-500" />
                          ) : (
                            <PinOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <div className="flex items-center">
                          <div className="mr-4">
                            <Checkbox
                              checked={selectedCourses.includes(course.id)}
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
                            <div className="flex items-center">{renderEnrollmentStatus(course)}</div>
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

            <div className="mt-6 p-4 border rounded-md bg-muted/20">
              <h3 className="font-medium mb-2">Selected Courses in Schedule {activeSchedule}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedCourses.length > 0
                  ? `${selectedCourses.length} course${selectedCourses.length > 1 ? "s" : ""} selected`
                  : "No courses selected"}
              </p>
            </div>
          </div>

          {/* Schedule Preview Section */}
          <div className="lg:self-center">
            <SchedulePreview
              weekNumber={weekNumber}
              totalWeeks={totalWeeks}
              onPrevWeek={() => setWeekNumber((prev) => Math.max(1, prev - 1))}
              onNextWeek={() => setWeekNumber((prev) => Math.min(totalWeeks, prev + 1))}
              courses={selectedCourseBlocks}
              dates={weekDates}
              scheduleNumber={activeSchedule}
              onTogglePin={(courseId) => toggleCoursePinned(courseId)}
              onSaveSchedule={() => setSaveDialogOpen(true)}
              onGetSchedule={handleGetSchedule}
            />

            {/* Save Schedule Dialog */}
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Save Schedule</DialogTitle>
                  <DialogDescription>Give your schedule a name to save it for later.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={scheduleName}
                      onChange={(e) => setScheduleName(e.target.value)}
                      className="col-span-3"
                      placeholder="Fall 2024 Schedule"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveCurrentSchedule}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <EnrollmentConfirmation
              open={confirmationOpen}
              onOpenChange={setConfirmationOpen}
              actions={pendingActions}
              onConfirm={handleConfirmActions}
              onCancel={handleCancelActions}
            />
          </div>

          {/* Saved Schedules Component - Now fixed positioned */}
          <SavedSchedules
            savedSchedules={savedSchedules}
            onRemoveSchedule={removeSavedSchedule}
            onLoadSchedule={loadSavedSchedule}
            onCollapse={() => setSavedSchedulesCollapsed(!savedSchedulesCollapsed)}
            isCollapsed={savedSchedulesCollapsed}
          />
        </div>
        {/* Confirmation Dialog */}
        <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Actions</DialogTitle>
              <DialogDescription>Are you sure you want to perform the following actions?</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <ul>
                {pendingActions.map((action, index) => (
                  <li key={index}>
                    {action.type === "enroll" && `Enroll in ${action.courseName}`}
                    {action.type === "waitlist" && `Join waitlist for ${action.courseName}`}
                    {action.type === "drop" && `Drop ${action.courseName}`}
                  </li>
                ))}
              </ul>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={handleCancelActions}>
                Cancel
              </Button>
              <Button onClick={handleConfirmActions}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <SuccessDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen} actions={pendingActions} />
      </div>
    </div>
  )
}