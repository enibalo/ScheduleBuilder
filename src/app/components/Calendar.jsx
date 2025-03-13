'use client'
import { useState } from 'react';

const Calendar = ({ courses = [], onScheduleChange }) => {
    const [currentSchedule, setCurrentSchedule] = useState(1);
    const [currentWeek, setCurrentWeek] = useState(0);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const totalSchedules = 88;

    // Time slots from 8 AM to 5 PM
    const timeSlots = Array.from({ length: 10 }, (_, i) => {
        const hour = i + 8;
        return `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'pm' : 'am'}`;
    });

    // Get dates for the current week
    const getWeekDates = (weekOffset) => {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(monday.getDate() - monday.getDay() + 1 + (weekOffset * 7));
        
        return days.map((_, index) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + index);
            return date.getDate();
        });
    };

    const dates = getWeekDates(currentWeek);

    // Group overlapping courses
    const getOverlappingCourses = (dayCourses) => {
        const sortedCourses = [...dayCourses].sort((a, b) => a.startTime - b.startTime);
        const groups = [];
        let currentGroup = [];

        sortedCourses.forEach((course) => {
            if (currentGroup.length === 0) {
                currentGroup.push(course);
            } else {
                const overlaps = currentGroup.some(
                    existingCourse => 
                        (course.startTime < existingCourse.endTime && 
                         course.endTime > existingCourse.startTime)
                );
                
                if (overlaps) {
                    currentGroup.push(course);
                } else {
                    if (currentGroup.length > 0) {
                        groups.push([...currentGroup]);
                    }
                    currentGroup = [course];
                }
            }
        });
        
        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    };

    const handlePrevSchedule = () => {
        setCurrentSchedule(prev => Math.max(1, prev - 1));
    };

    const handleNextSchedule = () => {
        setCurrentSchedule(prev => Math.min(totalSchedules, prev + 1));
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-2">
            {/* Navigation */}
            <div className="flex items-center justify-center gap-2 py-2">
                <button 
                    className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                    onClick={handlePrevSchedule}
                    disabled={currentSchedule === 1}
                >◀</button>
                <span className="text-sm">{currentSchedule} of {totalSchedules}</span>
                <button 
                    className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                    onClick={handleNextSchedule}
                    disabled={currentSchedule === totalSchedules}
                >▶</button>
            </div>

            {/* Calendar Container */}
            <div className="flex gap-1">
                {/* Time slots column */}
                <div className="flex flex-col pt-[46px] pr-2"> {/* Adjusted padding to align with header */}
                    {timeSlots.map((time) => (
                        <div 
                            key={time}
                            className="h-[40px] flex items-center justify-end text-xs text-gray-500"
                        >
                            {time}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="border rounded-md flex-1">
                    {/* Days row */}
                    <div className="grid grid-cols-5 border-b">
                        {days.map((day, index) => (
                            <div 
                                key={day} 
                                className="text-center py-1"
                            >
                                <div className="text-sm">{day}</div>
                                <div className="text-xs text-gray-500">Jan {dates[index]}</div>
                            </div>
                        ))}
                    </div>

                    {/* Calendar body */}
                    <div className="h-[400px] relative">
                        {/* Horizontal grid lines */}
                        {timeSlots.map((_, index) => (
                            <div
                                key={index}
                                className="absolute w-full border-t border-gray-100"
                                style={{ top: `${index * 40}px` }}
                            />
                        ))}

                        {/* Days columns with courses */}
                        <div className="grid grid-cols-5 h-full absolute inset-0">
                            {days.map((day) => {
                                const dayCourses = courses.filter(course => course.day === day.substring(0, 3));
                                const courseGroups = getOverlappingCourses(dayCourses);

                                return (
                                    <div 
                                        key={day} 
                                        className="relative border-r last:border-r-0"
                                    >
                                        {courseGroups.map((group, groupIndex) => (
                                            <div key={groupIndex}>
                                                {group.map((course, courseIndex) => {
                                                    const isOverlapping = group.length > 1;
                                                    const borderStyle = isOverlapping ? 'border-b-2 border-dashed border-white/50' : '';
                                                    return (
                                                        <div
                                                            key={`${groupIndex}-${courseIndex}`}
                                                            className={`absolute ${course.color} ${borderStyle}`}
                                                            style={{
                                                                top: `${(course.startTime - 8) * 40}px`,
                                                                height: `${(course.endTime - course.startTime) * 40}px`,
                                                                left: '2px',
                                                                right: '2px',
                                                                zIndex: courseIndex + 1,
                                                                clipPath: isOverlapping ? 
                                                                    courseIndex === group.length - 1 ? 
                                                                        'none' : 
                                                                        'polygon(0 0, 100% 0, 100% calc(100% - 2px), 0 calc(100% - 2px))'
                                                                    : 'none'
                                                            }}
                                                        >
                                                            <div className="text-xs p-1 overflow-hidden">
                                                                <div className="font-medium truncate">{course.code}</div>
                                                                <div className="truncate">{course.type}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 py-2">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm transition-colors">
                    GET SCHEDULE
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm transition-colors">
                    SAVE SCHEDULE
                </button>
            </div>
        </div>
    );
};

export default Calendar; 