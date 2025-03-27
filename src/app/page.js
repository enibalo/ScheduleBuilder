


import Image from "next/image";
import MainPage from "./components/SavedSchedules";
import Homepage from "./pages/Home";
import ScheduleBuilder from "./pages/ScheduleBuilder";
import CourseSearch from "./course-search";
import GetSchedule from "./pages/GetSchedule";

export default function Home() {
    const courses = [
            // Monday courses
            {
                code: 'CPSC 413',
                type: 'LEC',
                day: 'Mon',
                startTime: 10,
                endTime: 11,
                color: 'bg-green-200'
            },
            {
                code: 'SOCI 325',
                type: 'LEC',
                day: 'Mon',
                startTime: 10,
                endTime: 11.5,
                color: 'bg-yellow-200'
            },
            // Tuesday courses
            {
                code: 'CPSC 441',
                type: 'TUT',
                day: 'Tue',
                startTime: 10,
                endTime: 11,
                color: 'bg-pink-200'
            },
            // Wednesday overlapping courses
            {
                code: 'SOCI 325',
                type: 'LEC',
                day: 'Wed',
                startTime: 13,
                endTime: 14.5,
                color: 'bg-yellow-200'
            },
            {
                code: 'CPSC 441',
                type: 'LEC',
                day: 'Wed',
                startTime: 13,
                endTime: 14,
                color: 'bg-pink-200'
            },
            {
                code: 'CPSC 413',
                type: 'LEC',
                day: 'Wed',
                startTime: 13.5,
                endTime: 14.5,
                color: 'bg-green-200'
            },
            // Thursday courses with overlap
            {
                code: 'CPSC 413',
                type: 'LEC',
                day: 'Thu',
                startTime: 10,
                endTime: 11,
                color: 'bg-green-200'
            },
            {
                code: 'CPSC 441',
                type: 'TUT',
                day: 'Thu',
                startTime: 10.5,
                endTime: 11.5,
                color: 'bg-pink-200'
            },
            // Friday courses with triple overlap
            {
                code: 'SOCI 325',
                type: 'TUT',
                day: 'Fri',
                startTime: 14,
                endTime: 15,
                color: 'bg-yellow-200'
            },
            {
                code: 'CPSC 441',
                type: 'LAB',
                day: 'Fri',
                startTime: 14,
                endTime: 15.5,
                color: 'bg-pink-200'
            },
            {
                code: 'CPSC 413',
                type: 'LAB',
                day: 'Fri',
                startTime: 14.5,
                endTime: 15.5,
                color: 'bg-green-200'
            }
        ]
  return (
   <CourseSearch></CourseSearch>
  );
}
