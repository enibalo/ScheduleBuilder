'use client'
import { useState } from 'react';
import Image from 'next/image';

const SavedSchedules = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [savedSchedules] = useState([
        { 
            id: 1, 
            name: 'Schedule 1', 
            courses: ['CPSC 413', 'CPSC 441', 'SOCI 325'],
            image: '/Schedule1.png'
        },
        { 
            id: 2, 
            name: 'Schedule 2', 
            courses: ['CPSC 413', 'SOCI 325'],
            image: '/Schedule2.png'
        },
        { 
            id: 3, 
            name: 'Schedule 3', 
            courses: ['CPSC 441', 'SOCI 325'],
            image: '/Schedule3.png'
        },
    ]);
    const [editingId, setEditingId] = useState(null);

    return (
        <div className={`fixed top-0 right-0 h-full bg-[#f5f5f5] transition-[width] duration-300 ease-in-out overflow-y-auto z-10 flex flex-col items-center
            ${isOpen ? 'w-[300px]' : 'w-[50px] justify-center items-start'}`}
        >
            {/* Arrow button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`text-lg text-white bg-[#ae1818] hover:bg-[#8c1515] px-[10px] py-[6px] rounded-lg cursor-pointer 
                    transition-colors duration-300 shadow-md absolute top-[10px]
                    ${isOpen ? 'left-[10px]' : 'left-1/2 -translate-x-1/2'}`}
            >
                {isOpen ? '→' : '←'}
            </button>

            {/* Saved Schedules Content */}
            {isOpen && (
                <div className="p-5 overflow-y-scroll h-full flex flex-col items-center justify-start w-full font-['Times_New_Roman']">
                    <h2 className="text-2xl text-[#840f0f] font-bold text-center mb-[15px] mt-0 flex items-center justify-center relative -top-[5px]">
                        Saved Schedules
                    </h2>

                    {savedSchedules.map((schedule) => (
                        <div 
                            key={schedule.id}
                            className="bg-white p-[10px] my-[10px] w-full max-w-[260px] rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] text-center"
                        >
                            <div className="flex items-center justify-between w-full">
                                {editingId === schedule.id ? (
                                    <input
                                        type="text"
                                        value={schedule.name}
                                        className="text-base text-[#333] p-1 w-4/5 border border-[#ccc] rounded outline-none"
                                    />
                                ) : (
                                    <h3 className="text-lg text-[#333]">{schedule.name}</h3>
                                )}
                                <svg
                                    className="w-4 h-4 cursor-pointer ml-2 transition-transform duration-200 ease-in-out hover:scale-120"
                                    onClick={() => setEditingId(schedule.id === editingId ? null : schedule.id)}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </div>

                            {/* Schedule Preview Image */}
                            <div className="relative w-full h-[150px] mt-[10px] rounded-lg overflow-hidden">
                                <Image
                                    src={schedule.image}
                                    alt={`Preview of ${schedule.name}`}
                                    fill
                                    className="object-cover rounded-lg"
                                    priority
                                />
                            </div>

                            {/* Course List */}
                            <div className="w-full max-w-full mt-[10px]">
                                <div className="space-y-1">
                                    {schedule.courses.map((course, index) => (
                                        <div 
                                            key={index}
                                            className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded"
                                        >
                                            {course}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="bg-[#ae1818] text-white px-5 py-[10px] text-sm cursor-pointer rounded-lg 
                                transition-colors duration-300 mt-[10px] hover:bg-[#8c1515] w-full">
                                Load Schedule
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedSchedules;
