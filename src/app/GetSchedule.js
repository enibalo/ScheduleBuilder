import React from 'react'

export default function GetSchedule() {
  //enroll, drop, waitlist, no action
  // can't enroll and waitlist only one is applicable 
  const courses = [
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
  ];
  
  return (
    <ul>
        {courses.map((course)=>{
            <li> 
              <span> 
                <h3>{course.name}</h3>
                <p>{course.status}</p>
                {course.status == "Waitlisted" && <p>{course.placeInLine}</p>}
              </span> 
              <span> 
                <Dropdown id={course.name} default={course.current_action} list={course.actions} onSelect={(item)=> console.log(item)}></Dropdown>
              </span>
            </li>
        })}
    </ul>
  )
}



const Dropdown = ({ list, onSelect, id, default }) => {
  const [selected, setSelected] = useState("");

  const handleChange = (event) => {
    setSelected(event.target.value);
    if (onSelect) {
      onSelect(event.target.value);
    }
  };

  return (
    <div>
      <label htmlFor="dropdown" id={"dropdown-label-"+id}>Actions:</label>
      <select
        id={"dropdown-"+id}
        aria-labelledby="dropdown-label"
        value={selected}
        onChange={handleChange}
      >
        {list.map((item, index) => (
          <option key={index} value={item} selected>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};



export {Dropdown};
