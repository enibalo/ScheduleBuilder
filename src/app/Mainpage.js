'use client'
import React, { useState } from "react";
import styles from "./Mainpage.module.css";  
export default function Mainpage() {
  const [isOpen, setIsOpen] = useState(true);
  const [schedules, setSchedules] = useState([
    { id: 1, name: "Schedule 1" },
    { id: 2, name: "Schedule 2" },
    { id: 3, name: "Schedule 3" }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const toggleColumn = () => {
    setIsOpen(!isOpen);
  };

  const handleEditClick = (id, currentName) => {
    setEditingId(id);
    setNewTitle(currentName);
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleBlur = (id) => {
    saveTitle(id);
  };

  const handleKeyPress = (event, id) => {
    if (event.key === "Enter") {
      saveTitle(id);
    }
  };

  const saveTitle = (id) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, name: newTitle } : schedule
    ));
    setEditingId(null);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.column} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.arrow} onClick={toggleColumn}>
            {isOpen ? '>>' : '<<'}
        </div>
        {isOpen && (
          <div className={styles.savedSchedules}>
            <h2>Saved Schedules</h2>
            {schedules.map((schedule) => (
              <div key={schedule.id} className={styles.schedule}>
                <div className={styles.scheduleHeader}>
                  {editingId === schedule.id ? (
                    <input 
                      type="text"
                      value={newTitle}
                      onChange={handleTitleChange}
                      onBlur={() => handleBlur(schedule.id)}
                      onKeyDown={(event) => handleKeyPress(event, schedule.id)}
                      autoFocus
                      className={styles.editInput}
                    />
                  ) : (
                    <>
                      <h3>{schedule.name}</h3>
                      <img 
                        src="/editIcon.png" 
                        alt="Edit" 
                        className={styles.editIcon}
                        onClick={() => handleEditClick(schedule.id, schedule.name)}
                      />
                    </>
                  )}
                </div>
                <img src={`/Schedule${schedule.id}.png`} alt={schedule.name} className={styles.scheduleImage} />
                <button>Open in new tab</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
