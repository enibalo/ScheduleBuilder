'use client'
import { useState } from 'react';

const Calendar = ({ courses = [], scheduleIndex = 3, totalSchedules = 88 }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-2">
            {/* Navigation */}
            <div className="flex items-center justify-center gap-2 py-2">
                <button className="text-red-500">◀</button>
                <span className="text-sm">{scheduleIndex} of {totalSchedules}</span>
                <button className="text-red-500">▶</button>
            </div>

            {/* Calendar Grid */}
            <div className="border rounded-md">
                {/* Days row */}
                <div className="grid grid-cols-5 border-b">
                    {days.map((day) => (
                        <div 
                            key={day} 
                            className="text-center py-1 text-sm"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar body */}
                <div className="grid grid-cols-5 h-[400px]">
                    {days.map((day) => (
                        <div 
                            key={day} 
                            className="relative border-r last:border-r-0"
                        >
                            {/* Course blocks */}
                            {courses
                                .filter(course => course.day === day.substring(0, 3))
                                .map((course, idx) => (
                                    <div
                                        key={idx}
                                        className={`absolute ${course.color} m-[1px] rounded p-1`}
                                        style={{
                                            top: `${(course.startTime - 8) * 40}px`,
                                            height: `${(course.endTime - course.startTime) * 40}px`,
                                            left: '2px',
                                            right: '2px'
                                        }}
                                    >
                                        <div className="text-xs">
                                            {course.code}
                                            <br />
                                            {course.type}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 py-2">
                <button className="bg-red-500 text-white px-4 py-1 rounded text-sm">
                    GET SCHEDULE
                </button>
                <button className="bg-red-500 text-white px-4 py-1 rounded text-sm">
                    SAVE SCHEDULE
                </button>
            </div>
        </div>
    );
};

export default Calendar; 