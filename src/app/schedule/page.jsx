"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Search,
  Filter,
  Info,
  Calendar,
  Copy,
  Trash2,
  Plus,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SchedulePreview } from "@/app/components/schedule-preview"
import { SavedSchedules } from "@/app/components/saved-schedules"
import { SuccessDialog } from "@/app/components/success-dialog"
import { FilterDialog } from "@/app/components/filter-dialog"
import { AppHeader } from "@/app/components/app-header"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar"
import SuggestedCourses from "./SuggestCourses"

import baseData from "@/app/database/baseData.json";
import allCourses from "@/app/database/allClasses.json";
import CourseList from "@/app/components/CourseList"
import GetScheduleDialog from "@/app/components/GetScheduleDialog";

import { RequirementsDialog } from "./Requirements";

export default function CourseSearch() {
  // load data from the database
  function findClassByID(id) {
    let found = {}
    allCourses.forEach(course => {
      if (course.id === id) {
        found = course
      }
    })

    return found;
  }

  const courseSchedules = baseData.map((schedule, index) => {
    return {
      name: `Schedule ${index}`,
      id: index,
      courses: schedule.map(course => {
        return {
          ...course,
          ...findClassByID(course.id),
          selected: false,
          pinned: false
        }
      })
    }
  });


  const [enrolledCourses, setEnrolledCourses] = useState({ "1-1": "Waitlisted" });

  const [searchQuery, setSearchQuery] = useState("")
  const [activeSchedule, setActiveSchedule] = useState(0)
  const [activeScheduleData, setActiveScheduleData] = useState(courseSchedules[0])
  const [loadedSchedules, setLoadedSchedules] = useState(courseSchedules)
  const [weekNumber, setWeekNumber] = useState(1)
  const [savedSchedules, setSavedSchedules] = useState([])
  const [savedSchedulesCollapsed, setSavedSchedulesCollapsed] = useState(true)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [scheduleName, setScheduleName] = useState("")
  const [enrollmentStatus, setEnrollmentStatus] = useState({})
  const [selectedTerm, setSelectedTerm] = useState(localStorage.getItem("term"))
  const totalWeeks = 2

  // Add new state for tracking pending actions
  const [pendingActions, setPendingActions] = useState([])
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [requiredDialogOpen, setRequiredDialogOpen] = useState(false)

  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false);
  const [filters, setFilters] = useState({
    morningClasses: false,
    afternoonClasses: false,
    eveningClasses: false,
    requiredClasses: false,
    fullClasses: false,
    waitlistedClasses: false,
    onlineClasses: false,
  })

  const router = useRouter()
  const redirectHome = () => {
    setConfirmationOpen(false);
    router.push('/');
  }

  // whenever active schedule is changed, update the current scheduel to use
  useEffect(() => {
    setActiveScheduleData(loadedSchedules[activeSchedule])
  }, [activeSchedule])

  // update the loaded schedules when the current schedule is updated
  useEffect(() => {
    const newSchedules = loadedSchedules;
    newSchedules[activeSchedule] = activeScheduleData
    setLoadedSchedules(newSchedules);
  }, [activeScheduleData])

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
  const weekDates = calculateDates(1)

  // Convert selected courses to schedule blocks
  const selectedCourseBlocks = useMemo(() => {
    const blocks = []

    activeScheduleData.courses.forEach(course => {
      if (course.selected) {
        course["schedule" + weekNumber].forEach((scheduleItem, index) => {
          blocks.push({
            id: `${course.id}-${index}`,
            courseId: course.id,
            code: course.code,
            type: scheduleItem.type,
            day: scheduleItem.day,
            startHour: scheduleItem.startHour,
            duration: scheduleItem.duration,
            color: course.color,
            isPinned: course.pinned,
          })
        })
      }
    })

    return blocks
  }, [activeScheduleData, weekNumber])

  const toggleCourseSelection = (courseId) => {
    setActiveScheduleData({
      ...activeScheduleData,
      courses: activeScheduleData.courses.map(course => {
        if (course.id == courseId) {
          return { ...course, selected: !course.selected }
        }
        return course
      })
    })
  }

  const toggleCoursePinned = (courseId) => {
    setActiveScheduleData({
      ...activeScheduleData,
      courses: activeScheduleData.courses.map(course => {
        if (course.id == courseId) {
          return { ...course, pinned: !course.pinned }
        }
        return course
      })
    })
  }

  const saveCurrentSchedule = () => {
    if (!scheduleName.trim()) return

    const newSchedule = {
      id: Date.now().toString(),
      name: scheduleName,
      scheduleNumber: activeSchedule,
      courses: activeScheduleData.courses,
      savedAt: new Date().toISOString(),
    }

    setSavedSchedules((prev) => [newSchedule, ...prev])
    setScheduleName("")
    setSaveDialogOpen(false)
  }

  function addEmptySchedule() {
    addTab({
      name: `New Schedule`,
      id: Date.now().toString(),
      courses: []
    })
  }

  function addTab(schedule) {
    // add the schedule to the list of schedules
    const current = loadedSchedules;
    current.push(schedule);
    setLoadedSchedules(current);

    // select the new schedule
    setActiveSchedule(loadedSchedules.length - 1);
  }

  function removeCurrentSchedule() {
    if (loadedSchedules.length <= 1) {
      setActiveScheduleData({
        ...activeScheduleData, courses: []
      })
      return;
    }
    setLoadedSchedules(loadedSchedules.filter((s, index) => index != activeSchedule));
    setActiveSchedule(0);
  }

  const loadSavedSchedule = (scheduleId) => {
    const schedule = savedSchedules.find((s) => s.id === scheduleId)
    if (!schedule) return

    addTab(schedule);
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

  const handleAction = (courseId, action) => {
    const course = activeScheduleData.courses.find((c) => c.id === courseId)
    setPendingActions((prev) => [
      ...prev,
      {
        type: action,
        courseId,
        courseName: course.code,
      },
    ])
  }

  // Add a new function to handle the "Get Schedule" button click
  const handleGetSchedule = () => {
    setConfirmationOpen(true)
  }

  // Add confirmation handlers
  const handleConfirmActions = () => {
    pendingActions.forEach((action) => {
      switch (action.type) {
        case "enroll":
          updateEnrollmentStatus(action.courseId, "enrolled")
          if (!activeScheduleData.includes(action.courseId)) {
            toggleCourseSelection(action.courseId)
          }
          break
        case "waitlist":
          updateEnrollmentStatus(action.courseId, "waitlisted")
          if (!activeScheduleData.includes(action.courseId)) {
            toggleCourseSelection(action.courseId)
          }
          break
        case "drop":
          updateEnrollmentStatus(action.courseId, "not-enrolled")
          if (activeScheduleData.includes(action.courseId)) {
            toggleCourseSelection(action.courseId)
          }
          break
      }
    })

    let newEnrolledCourses = {}


    pendingActions.forEach((action) => {
      if (action.type != "drop") {
        const courseKey = action.id + "-" + weekNumber
        const capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1);
        newEnrolledCourses[courseKey] = capitalizeFirst(action.type + "ed")
      }
    })

    setEnrolledCourses((newEnrolledCourses))

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

  function addCourseToSchedule(courseId) {
    const course = allCourses.filter(course => course.id === courseId)[0];

    setActiveScheduleData({
      ...activeScheduleData,
      courses: [
        ...activeScheduleData.courses,
        {
          ...course,
          selected: false,
          pinned: false,
          status: "none"
        }
      ]
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <div className="w-full max-w-[1400px] mx-auto p-4 pt-6 flex items-center min-h-[calc(100vh-4rem)]">
        <div className="flex gap-12 w-full items-start">
          {/* Course Search Section */}
          <div className="w-1/2">
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
                <SearchBar filters={filters} courses={allCourses} onSelect={addCourseToSchedule}></SearchBar>
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
              {/* create tabs */}
              <div className="flex border-b overflow-auto scrollbar-none overflow-y-hidden">
                {
                  loadedSchedules.map((schedule, index) => {
                    return <div key={index}
                      className={`relative px-4 py-2 flex items-center cursor-pointer ${activeSchedule === index
                        ? "bg-background text-foreground border-l border-t border-r rounded-t-md -mb-px"
                        : "text-muted-foreground hover:bg-muted/50"
                        }`}
                      onClick={() => setActiveSchedule(index)}
                    >
                      <span className="text-sm font-medium">{schedule.name}</span>
                      {activeSchedule === index && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />}
                    </div>
                  })
                }

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="relative mx-3 flex items-center cursor-pointer text-muted-foreground hover:bg-muted/50"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          addEmptySchedule();
                        }}
                      >
                        <Plus className="h-2 w-2" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create a new tab</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

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
                          addTab(activeScheduleData);
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

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={removeCurrentSchedule}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove this tab</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

              </div>
            </div>

            <CourseList courses={activeScheduleData.courses} weekNumber={weekNumber} enrolledCourses={enrolledCourses} toggleCourseSelection={toggleCourseSelection} toggleCoursePinned={toggleCoursePinned} />

            <SuggestedCourses onAddCourse={addCourseToSchedule}></SuggestedCourses>
          </div>

          {/* Schedule Preview Section */}
          <div className="w-1/2 lg:self-center">
            <SchedulePreview
              weekNumber={weekNumber}
              totalWeeks={totalWeeks}
              onPrevWeek={() => {
                // ignore attempts to go past page 1 
                let week = weekNumber != 1 ? weekNumber - 1 : weekNumber;
                setWeekNumber(week);
              }}
              onNextWeek={() => {
                let week = weekNumber != 2 ? weekNumber + 1 : weekNumber;
                setWeekNumber(week);
              }}
              courses={selectedCourseBlocks}
              dates={weekDates}
              scheduleName={activeScheduleData.name}
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
        <GetScheduleDialog open={confirmationOpen} courses={activeScheduleData.courses} onConfirm={handleConfirmActions} onCancel={handleCancelActions} />
        <RequirementsDialog open={requiredDialogOpen} onConfirm={() => { console.log("item added"); setRequiredDialogOpen(false) }} onCancel={() => setRequiredDialogOpen(false)}></RequirementsDialog>
        <SuccessDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen} actions={pendingActions} />
      </div>
    </div>
  )
}

