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


import { ServerInsertedHTMLContext, useRouter } from "next/navigation";
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

  const initalCourses =
    [{
      name: `Schedule ${0}`,
      id: Date.now().toString(),
      courses: []
    }];

  // baseData.map((schedule, index) => {
  //     return {
  //       name: `Schedule ${index}`,
  //       id: index,
  //       courses: schedule.map(course => {
  //         return {
  //           ...course,
  //           ...findClassByID(course.id),
  //           selected: false,
  //           pinned: false
  //         }
  //       })
  //     }
  //   });

  const [searchQuery, setSearchQuery] = useState("")
  const [activeSchedule, setActiveSchedule] = useState(0)
  const [loadedSchedules, setLoadedSchedules] = useState(initalCourses)
  const [activeScheduleData, setActiveScheduleData] = useState(initalCourses[0])
  const [weekNumber, setWeekNumber] = useState(0)
  const [savedSchedules, setSavedSchedules] = useState([])
  const [savedSchedulesCollapsed, setSavedSchedulesCollapsed] = useState(true)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [scheduleName, setScheduleName] = useState("")
  const [enrollmentStatus, setEnrollmentStatus] = useState({})
  const [selectedTerm, setSelectedTerm] = useState(localStorage.getItem("term"))
  const [totalWeeks, setTotalWeeks] = useState(0)
  const [selectedCourse, setSelectedCourse] = useState("")

  const [courseActions, setCourseActions] = useState([])
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

  useEffect(() => {

    const countSelected = activeScheduleData.courses.reduce((acc, course) => acc + course.selected, 0)
    const countToggled = activeScheduleData.courses.reduce((acc, course) => acc + course.pinned, 0)

    //while schedule is empty 
    if (countSelected == 0) {
      setTotalWeeks(0)
      setWeekNumber(0)
      //first item is added to schedule 
    } else {
      if (totalWeeks == 0) {
        setTotalWeeks(2)
        setWeekNumber(1)
      }
    }

    //if all courses are pinned 
    if (countSelected > 0 && countToggled == countSelected) {
      setTotalWeeks(1)
      setWeekNumber(1)
      // if one course is released from pinned state 
    } else {
      if (totalWeeks == 1) {
        setTotalWeeks(2)
      }
    }

  }, [activeScheduleData])

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
  const [selectedCourseBlocks, conflictBlocks] = useMemo(() => {
    const blocks = []
    const conflicts = []

    activeScheduleData.courses.forEach(course => {
      if (course.selected) {
        {/*Handle pinned courses by checking a course's currentWeek */ }
        course["schedule" + course.currentWeek].forEach((scheduleItem, index) => {
          blocks.push({
            id: `${course.id}-${index}`,
            courseId: course.id,
            code: course.code,
            type: scheduleItem.type,
            day: scheduleItem.day,
            currentWeek: course.currentWeek,
            startHour: scheduleItem.startHour,
            duration: scheduleItem.duration,
            color: course.color,
            isPinned: course.pinned,
          })

          // get conflict blocks
          activeScheduleData.courses.forEach(course2 => {
            if (course2.selected && course2.id !== course.id) {
              course2["schedule" + course2.currentWeek].forEach((scheduleItem2, index2) => {
                if (scheduleItem2.day === scheduleItem.day) {
                  if (scheduleItem2.startHour >= scheduleItem.startHour && scheduleItem2.startHour <= (scheduleItem.startHour + scheduleItem.duration)) {
                    conflicts.push({
                      course1: course.code,
                      course2: course2.code,
                      day: scheduleItem.day,
                      startHour: scheduleItem2.startHour,
                      duration: (scheduleItem.startHour + scheduleItem.duration) - scheduleItem2.startHour
                    })
                  }
                }
              })
            }
          })
        })
      }
    })

    return [blocks, conflicts]
  }, [activeScheduleData])

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
      name: `Schedule ${loadedSchedules.length}`,
      id: Date.now().toString(),
      courses: []
    })
  }

  function handleSelectedTerm(term) {
    setLoadedSchedules([{
      name: `Schedule ${0}`,
      id: Date.now().toString(),
      courses: []
    }]);
    setActiveSchedule(0);
    setActiveScheduleData(loadedSchedules[0]);
    setSelectedTerm(term);
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

  // Add a new function to handle the "Get Schedule" button click
  const handleGetSchedule = () => {
    setConfirmationOpen(true)
  }

  // Add confirmation handlers
  const handleConfirmActions = () => {
    const completedActions = []
    const updatedCourseList = activeScheduleData.courses.map(course => {
      if (course.status === "None") {
        if (course.seats.taken < course.seats.total) {
          completedActions.push({ courseName: course.code, type: "enroll" })
          return { ...course, status: "Enrolled" }
        }
        if (course.waitlist.count < course.waitlist.capacity) {
          completedActions.push({ courseName: course.code, type: "waitlist" })
          return { ...course, status: "Waitlisted" }
        }
      }
      completedActions.push({ courseName: course.code, type: "none" })
      return course;
    });


    setActiveScheduleData({
      ...activeScheduleData, courses: updatedCourseList
    })

    setCourseActions(completedActions);

    setConfirmationOpen(false)
    setSuccessDialogOpen(true)
  }

  const handleCancelActions = () => {
    setConfirmationOpen(false)
  }

  const handleSaveFilters = () => {
    setFilterDialogOpen(false)
  }

  const handleDeleteCourse = (courseId) => {
    const newCourses = activeScheduleData.courses.filter(course => course.id != courseId)
    setActiveScheduleData({
      ...activeScheduleData,
      courses: newCourses,
    })

  }

  function addCourseToSchedule(courseId) {
    const newCourse = allCourses.find(item => item.id === courseId)
    setSelectedCourse(newCourse)

    if (newCourse.requiredClasses) {
      if (activeScheduleData.courses.includes(item => item.id == courseId) == false) {
        addCourse(newCourse)
      }

    } else {
      setRequiredDialogOpen(true)
    }
  }

  function addCourse(course) {
    setActiveScheduleData({
      ...activeScheduleData,
      courses: [
        ...activeScheduleData.courses,
        {
          ...course,
          currentWeek: (weekNumber == 0 ? 1 : weekNumber),
          selected: false,
          pinned: false,
          status: "None"
        }
      ]
    })
  }


  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '40% 1fr',
    gap: '4em',
    maxWidth: "1130px",
  };


  return (
    <div className="min-h-screen bg-gray-50 text-sm"> {/* ↓ base text size */}
      <AppHeader />

      <div className="w-full max-w-[1400px] mx-auto p-2 pt-2 flex min-h-screen justify-center"> {/* ↓ padding, align top */}
        <div className="p-2  w-full items-start" style={gridStyle}> {/* ↓ gap */}
          {/* {
    gridColumn: 'span 1',
  }; */}
          {/* Course Search Section */}
          <div className="space-y-3" style={{ maxWidth: "480px", }}> {/* ↓ vertical spacing */}

            {/* Term selection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span className="text-xs font-medium mr-1">Term:</span>
                </div>
                <Select value={selectedTerm} onValueChange={handleSelectedTerm}>
                  <SelectTrigger className="w-[150px] h-7 text-xs"> {/* ↓ smaller input */}
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
                      <Button variant="ghost" size="icon" className="relative z-10 h-6 w-6 p-0 hover:bg-transparent"> {/* ↓ smaller button */}
                        <Info className="h-3.5 w-3.5 text-red-500" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm p-2 text-xs"> {/* ↓ padding and text size */}
                    <div className="space-y-1.5">
                      <p className="font-medium">How to select and enroll in courses:</p>
                      <ol className="list-decimal pl-4 space-y-0.5">
                        <li>Use the search box to find courses</li>
                        <li>Click the checkbox to add a course</li>
                        <li>Pin courses with the pin icon</li>
                        <li>Click "Not Enrolled" for options</li>
                        <li>Click "Get Schedule" to confirm</li>
                      </ol>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Search and filter row */}
            <div className="flex flex-col md:flex-row gap-2 items-start">
              <div className="relative flex-1">
                <SearchBar filters={filters} courses={allCourses} onSelect={addCourseToSchedule} />
              </div>
              <Button variant="outline" className="h-8 px-2 text-xs" onClick={() => setFilterDialogOpen(true)}>
                <Filter className="h-3.5 w-3.5 mr-1" />
                Filters
              </Button>
              <FilterDialog {...{ open: filterDialogOpen, onOpenChange: setFilterDialogOpen, filters, onFiltersChange: setFilters, onSave: handleSaveFilters }} />
            </div>

            {/* Tab section */}
            <div>
              <div className="flex border-b overflow-auto scrollbar-none overflow-y-hidden text-xs">
                {loadedSchedules.map((schedule, index) => (
                  <div key={index}
                    className={`relative px-2 py-1 flex items-center cursor-pointer ${activeSchedule === index
                      ? "bg-background text-foreground border-l border-t border-r rounded-t-md -mb-px"
                      : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    onClick={() => setActiveSchedule(index)}
                  >
                    <span>{schedule.name}</span>
                    {activeSchedule === index && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />}
                  </div>
                ))}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="mx-1 text-muted-foreground hover:bg-muted/50"
                        variant="outline"
                        size="icon"
                        onClick={addEmptySchedule}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create a new tab</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex-1 border-b -mb-px"></div>
              </div>

              {/* Schedule action buttons */}
              <div className="flex justify-end items-center gap-2 mt-1 mb-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => addTab({ ...activeScheduleData, name: `Schedule ${loadedSchedules.length}` })}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Copy</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={removeCurrentSchedule}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Remove</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <CourseList {...{ onDeleteCourse: handleDeleteCourse, courses: activeScheduleData.courses, conflicts: conflictBlocks, toggleCourseSelection, toggleCoursePinned }} />

          </div>

          {/* Schedule Preview */}
          <div className="" >
            <SchedulePreview {...{
              weekNumber, totalWeeks, courses: selectedCourseBlocks, dates: weekDates,
              conflicts: conflictBlocks,
              scheduleName: activeScheduleData.name,
              onTogglePin: toggleCoursePinned,
              onSaveSchedule: () => setSaveDialogOpen(true),
              onGetSchedule: handleGetSchedule,
              onPrevWeek: () => {
                const week = weekNumber !== 1 ? weekNumber - 1 : weekNumber;
                setWeekNumber(week);
                setActiveScheduleData({
                  ...activeScheduleData,
                  courses: activeScheduleData.courses.map(c =>
                    c.pinned ? c : { ...c, currentWeek: week }
                  )
                });
              },
              onNextWeek: () => {
                if (totalWeeks === 1) return;
                const week = weekNumber !== 2 ? weekNumber + 1 : weekNumber;
                setWeekNumber(week);
                setActiveScheduleData({
                  ...activeScheduleData,
                  courses: activeScheduleData.courses.map(c =>
                    c.pinned ? c : { ...c, currentWeek: week }
                  )
                });
              }
            }} />

            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogContent className="sm:max-w-[400px] h-auto text-sm">
                <DialogHeader>
                  <DialogTitle>Save Schedule</DialogTitle>
                  {activeScheduleData.courses.length > 0 ? <DialogDescription>Name your schedule to save it.</DialogDescription> :
                    <div>Please add at least one course to your schedule before attempting to save it.</div>}
                </DialogHeader>
                <div className="grid gap-3 py-3">
                  <div className="grid grid-cols-4 items-center gap-2">
                    {activeScheduleData.courses.length > 0 &&
                      <><Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={scheduleName} onChange={(e) => setScheduleName(e.target.value)} className="col-span-3 h-8" /></>
                    }

                  </div>
                </div>
                <DialogFooter>
                  {activeScheduleData.courses.length > 0 &&
                    <>
                      <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
                      <Button onClick={saveCurrentSchedule}>Save</Button>
                    </>}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Fixed Saved Schedules */}
          <SavedSchedules {...{
            savedSchedules, onRemoveSchedule: removeSavedSchedule,
            onLoadSchedule: loadSavedSchedule,
            onCollapse: () => setSavedSchedulesCollapsed(!savedSchedulesCollapsed),
            isCollapsed: savedSchedulesCollapsed
          }} />
          <SuggestedCourses onAddCourse={addCourseToSchedule} />
        </div>
        {/* Confirmation Dialog */}
        <GetScheduleDialog open={confirmationOpen} courses={activeScheduleData.courses} onConfirm={handleConfirmActions} onCancel={handleCancelActions} />
        <RequirementsDialog course={selectedCourse} open={requiredDialogOpen} onConfirm={() => { addCourse(selectedCourse); setRequiredDialogOpen(false) }} onCancel={() => setRequiredDialogOpen(false)}></RequirementsDialog>
        <SuccessDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen} actions={courseActions} />
      </div>
    </div>
  )

}

