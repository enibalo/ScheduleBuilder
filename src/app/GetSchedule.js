'use client'
import  {useState, useEffect} from "react";

export default function GetSchedule() {
  const [courses, setCourses] = useState([
    { 
      name: "CPSC 441", 
      status: "Enrolled", 
      placeInLine: null, 
      actions: ["Drop", "No Action"], 
      current_action: "Drop"
    },
    { 
      name: "CPSC 457", 
      status: "Waitlisted", 
      placeInLine: "12 of 150", 
      actions: ["Drop", "No Action"],
      current_action: "Drop"
    },
    { 
      name: "CPSC 413", 
      status: "None", 
      placeInLine: null, 
      actions: ["Enroll", "No Action"],
      current_action: "Enroll" 

    },
    { 
      name: "CPSC 481", 
      status: "Waitlisted", 
      placeInLine: "33 of 188", 
      actions: ["Drop", "No Action"],
      current_action: "Drop"

    }
  ]);

  const colors = [" #a5d6a7", "#ef9a9a", "#fff59d", "#ce93d8"]

  const handleChange = (index, newAction) => {
    const updatedCourses = [...courses];
    updatedCourses[index].current_action = newAction;
    setCourses(updatedCourses);
  };

  const categorizedCourses = {
    Enrolled: [],
    Waitlisted: [],
    Drop: []
  };

  courses.forEach((course) => {
    const action = course.current_action === "No Action" ? course.status : course.current_action;
    if (action === "Enrolled") {
      categorizedCourses.Enrolled.push(course.name);
    } else if (action === "Waitlisted") {
      categorizedCourses.Waitlisted.push(course.name);
    } else {
      categorizedCourses.Drop.push(course.name);
    }
  });

  return (
    <>
    <header style={style.header}>
        <div>University of Calgary</div>
    </header>
    <main style={{ display: "flex"}}>
      <div style={{alignSelf: "flex-end"}}>
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <td style={{"backgroundColor" : colors[index % colors.length] }}>
                  {course.name}
                  <br />
                  {course.status}
                  {course.placeInLine && <div>{course.placeInLine}</div>}
                </td>
                <td>
                  <select
                    value={course.current_action}
                    onChange={(e) => handleChange(index, e.target.value)}
                  >
                    {course.actions.map((action, i) => (
                      <option key={i} value={action}>{action}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginLeft: "20px", border: "1px solid black", padding: "10px" }}>
        <h3>Confirm Changes</h3>
        <table>
          <thead>
            <tr>
              <th style={{ textDecoration: 'underline' }}>Enroll</th>
              <th style={{ textDecoration: 'underline' }}>Waitlist</th>
              <th style={{ textDecoration: 'underline' }}>Drop</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{categorizedCourses.Enrolled.join(", ")}</td>
              <td>{categorizedCourses.Waitlisted.join(", ")}</td>
              <td>{categorizedCourses.Drop.join(", ")}</td>
            </tr>
          </tbody>
        </table>
        <button style={style.button}>Cancel</button>
        <button style={style.button}>Confirm</button>
      </div>
    </main>
    </>
  );
}


  const style = { 
    header: {
      padding: "20px",
      fontSize: "",
      backgroundColor : "#8d827a",
      color: "white",
      fontSize: "2.2em",
    },

    button: {
      borderRadius: "4px",
      color: "white",
      padding: "8px 12px 9px 12px",
      fontWeight: 500,
      letterSpacing: ".08929em",
      textTransform: "uppercase",
      boxShadow: "0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)",
      height: "36px",
      backgroundColor: "#E30300", 
    }

    
  }