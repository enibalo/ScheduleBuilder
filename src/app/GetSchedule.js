'use client'
import  {useState, useEffect} from "react";
import style from "./Get.module.css";

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
      status: "None", 
      placeInLine: null, 
      actions: ["Waitlist", "No Action"],
      current_action: "Waitlist"
    }
  ]);

  const colors = [" #a5d6a7", "#ef9a9a", "#fff59d", "#ce93d8"]

  const handleChange = (index, newAction) => {
    const updatedCourses = [...courses];
    updatedCourses[index].current_action = newAction;
    setCourses(updatedCourses);
  };


  const [categories, setCategories] = useState({
    Enrolled: [],
    Waitlisted: [],
    Drop: []
  });

  useEffect(()=>{
    courses.forEach((course) => {

      const action = course.current_action === "No Action" ? course.status : course.current_action;
      console.log(action)
      let newCategories = {...categories}
      if (action === "Enroll") {
        newCategories.Enrolled.push(course.name);
        
      } else if (action === "Waitlist") {
        newCategories.Waitlisted.push(course.name);
        
      } else {
        newCategories.Drop.push(course.name);
      }
      setCategories(newCategories)
      console.log(newCategories)
    });
  },[])

  

  return (
    <div id={style.body}>
    <header id={style.header}>
        <div>University of Calgary</div>
    </header>
    <main id={style.main}>
      <section id={style.left}>
        <ul id={style.courseList}>
          {courses.map((course, index) => (
            <li key={index} className={style.course} style={{ backgroundColor: colors[index % colors.length] }}>
              <div>
                <strong>{course.name}</strong>
                <br />
                <div className={style.smallText}>
                {course.status}
                {course.placeInLine && <div>{course.placeInLine}</div>}
                </div>
              </div>
              <div className={style.action}>
                <label htmlFor={`action-${index}`}>Action:</label>
                <select
                  id={`action-${index}`}
                  className={style.dropDown}
                  value={course.current_action}
                  onChange={(e) => handleChange(index, e.target.value)}
                >
                  {course.actions.map((action, i) => (
                    <option key={i} value={action}>{action}</option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>

      </section>
      
      <section id={style.right}>
        <div id={style.box}>
        <div id={style.listContainer}> 
          <div>
            <h4 className="underline">Enroll</h4>
            <ul className={style.list}>
              {categories.Enrolled.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="underline">Waitlist</h4>
            <ul className={style.list}>
              {categories.Waitlisted.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="underline">Drop</h4>
            <ul className={style.list}>
              {categories.Drop.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div id={style.buttonContainer}> 
          <button id={style.button}>Cancel</button>
          <button id={style.button}>Confirm</button>
        </div>
        </div>
      </section>
    </main>
    </div>
  );
}


