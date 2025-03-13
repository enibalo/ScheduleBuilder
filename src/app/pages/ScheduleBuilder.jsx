'use client'
import { useState } from "react";
import Calendar from "../components/Calendar";

export default function ScheduleBuilder() {
    // Example courses data
    const [courses] = useState([
        {
            code: 'CPSC 413',
            type: 'LEC',
            day: 'Mon',
            startTime: 10,
            endTime: 11,
            color: 'bg-green-200'
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
            startTime: 13,
            endTime: 14,
            color: 'bg-yellow-200'
        },
        {
            code: 'CPSC 413',
            type: 'LEC',
            day: 'Thu',
            startTime: 10,
            endTime: 11,
            color: 'bg-green-200'
        },
        // Add more courses as needed
    ]);

    return(
        <div className="w-full min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <Calendar 
                    courses={courses}
                    scheduleIndex={3}
                    totalSchedules={88}
                />
            </div>
        </div>
    );
}
