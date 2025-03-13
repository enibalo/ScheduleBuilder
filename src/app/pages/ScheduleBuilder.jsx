'use client'
import { useState } from "react";

export default function ScheduleBuilder() {
    return(
        <div className="w-full h-[100vh] flex items-center">
            {/* Course Search */}
            <div className="w-1/2 h-full bg-blue-500">
                <h1>Course Search</h1>
            </div>
            {/* Calendar View */}
            <div className="w-1/2 h-full bg-red-500">
                <h1>Course List</h1>
            </div>
            {/* Saved Schedules*/}
            <div className="w-1/2 h-full bg-green-500">
                <h1>Saved Schedules</h1>
            </div>
        </div>
    );
}
