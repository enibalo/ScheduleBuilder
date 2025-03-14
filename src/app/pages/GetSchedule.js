"use client";
import { useState, useEffect } from "react";
import style from "./Get.module.css";
import { AppHeader } from "../components/app-header";
import App from "next/app";

export default function GetSchedule() {
  const [courses, setCourses] = useState([
    {
      name: "CPSC 441",
      status: "Enrolled",
      placeInLine: null,
      actions: ["Drop", "No Action"],
      current_action: "Drop",
    },
    {
      name: "CPSC 457",
      status: "Waitlisted",
      placeInLine: "12 of 150",
      actions: ["Drop", "No Action"],
      current_action: "Drop",
    },
    {
      name: "CPSC 413",
      status: "None",
      placeInLine: null,
      actions: ["Enroll", "No Action"],
      current_action: "Enroll",
    },
    {
      name: "CPSC 481",
      status: "None",
      placeInLine: null,
      actions: ["Waitlist", "No Action"],
      current_action: "Waitlist",
    },
  ]);

  const colors = ["green", "yellow", "pink"];

  const handleChange = (index, newAction) => {
    const updatedCourses = [...courses];
    updatedCourses[index].current_action = newAction;
    setCourses(updatedCourses);
  };

  const [categories, setCategories] = useState({
    Enrolled: [],
    Waitlisted: [],
    Drop: [],
  });

  useEffect(() => {
    courses.forEach((course) => {
      const action =
        course.current_action === "No Action"
          ? course.status
          : course.current_action;
      console.log(action);
      let newCategories = { ...categories };
      if (action === "Enroll") {
        newCategories.Enrolled.push(course.name);
      } else if (action === "Waitlist") {
        newCategories.Waitlisted.push(course.name);
      } else {
        newCategories.Drop.push(course.name);
      }
      setCategories(newCategories);
      console.log(newCategories);
    });
  }, []);

  const semesterChange = (semester) => {
    console.log(semester);
  };

  const semesters = ["Fall", "Winter"];
  //add status: and go back button. do we need course list drop down. point of agenda is to build schedule in there!!!!
  return (
    <div id={style.body}>
      <AppHeader></AppHeader>
      <div id={style.outer}>
        <div id={style.center}>
          <main id={style.main}>
            <section id={style.left}>
              <ul id={style.courseList} className="">
                {courses.map((course, index) => (
                  <li key={index} className={`flex justify-between gap-4 p-4 border-1`}>
                    <div className={`flex flex-col`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">{course.name}</h3>
                      </div>
                      <div className="space-y-2 justify-self-end">
                        <div className="flex-col items-center justify-between text-sm">
                          <div>Current Status: {course.status}</div>
                          {course.status == "Waitlisted" && <div>Position: 4/5</div>}
                        </div>
                      </div>
                    </div>
                    <div className={`${style.action} justify-end text-sm`}>
                      <label htmlFor={`action-${index}`}>Action:</label>
                      <select
                        id={`action-${index}`}
                        className={style.dropDown}
                        value={course.current_action}
                        onChange={(e) => handleChange(index, e.target.value)}
                      >
                        {course.actions.map((action, i) => (
                          <option key={i} value={action}>
                            {action}
                          </option>
                        ))}
                      </select>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <Table categories={categories}></Table>
              {/* <PopUp></PopUp>*/}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function CheckMark() {
  return (
    <svg className={style.icon} width="24" height="24" viewBox="0 0 24 24">
      <path d="M5 13l4 4L19 7" stroke="green" strokeWidth="2" fill="none" />
    </svg>
  );
}

function Table({ categories }) {
  return (
    <div id={style.box}>
      <div id={style.listContainer}>
        <div>
          <h4 className="underline font-bold">Enroll</h4>
          <ul className={style.list}>
            {categories.Enrolled.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="underline font-bold ">Waitlist</h4>
          <ul className={style.list}>
            {categories.Waitlisted.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="underline font-bold">Drop</h4>
          <ul className={style.list}>
            {categories.Drop.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className={style.buttonContainer}>
        <button className={style.button}>Cancel</button>
        <button className={style.button}>Confirm</button>
      </div>
    </div>
  );
}

function PopUp(props) {
  const courses = ["CPSC 457", "CPSC 413"];

  return (
    <ul id={style.statusList}>
      {courses.map((course, index) => {
        return (
          <li key={"congrats-" + index} className={style.statusItem}>
            <CheckMark />
            <span>Congratulations! You enrolled in {course}.</span>
          </li>
        );
      })}
    </ul>
  );
}

export { PopUp, Checkmark };
