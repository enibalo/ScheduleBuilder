'use client'
import { useState } from 'react';
import SearchBar from './Search/SearchBar';
import SearchFilters from './Search/SearchFilters';

const CourseSearch = ({ courses = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Transform calendar courses into course list format
    const transformedCourses = Array.from(new Set(courses.map(course => course.code)))
        .map(courseCode => {
            const courseSections = courses.filter(c => c.code === courseCode);
            return {
                code: courseCode,
                sections: courseSections.map(section => ({
                    type: `${section.type}`,
                    seats: "25/100", // This would need to come from your backend
                    waitlist: "0/40", // This would need to come from your backend
                    hasAlert: false
                }))
            };
        });

    return (
        <div className="w-full max-w-md bg-white rounded-lg shadow">
            {/* Search Bar */}
            <div className="p-2">
                <SearchBar />
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="p-2">
                    <SearchFilters />
                </div>
            )}

            {/* Course List */}
            <div className="divide-y">
                {transformedCourses.map((course) => (
                    <div key={course.code} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold">{course.code}</h3>
                            <input type="checkbox" className="h-4 w-4" />
                        </div>
                        <div className="space-y-2">
                            {course.sections.map((section, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="w-20">{section.type}</div>
                                    <div className="w-20 text-center">{section.seats}</div>
                                    <div className="w-20 text-center">{section.waitlist}</div>
                                    {section.hasAlert && (
                                        <div className="text-yellow-500">
                                            <svg 
                                                className="w-5 h-5" 
                                                fill="currentColor" 
                                                viewBox="0 0 20 20"
                                            >
                                                <path 
                                                    fillRule="evenodd" 
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                                                    clipRule="evenodd" 
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseSearch; 