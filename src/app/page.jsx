"use client";
import { useState } from "react";
import styles from "./Home.module.css";
import { AppHeader } from "./components/app-header";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Video from "./media/video.png";
import { useRouter } from "next/navigation";
import Image from 'next/image'


export default function Homepage() {
  //filtercourses.sort
    const router = useRouter();
    const redirectSchedule = (e) =>{
      const term = e.target.value; 
      localStorage.setItem("term", term)
      router.push('/schedule');
    }

  return (
    <>
      <AppHeader></AppHeader>
      <div className={styles.container + " p-4"}>
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.buttonColumn}>
              <button onClick={redirectSchedule} value={"spring2025"} className={styles.largeButton}>Spring 2025</button>
              <button onClick={redirectSchedule} value={"summer2025"} className={styles.largeButton}>Summer 2025</button>
              <button onClick={redirectSchedule} value={"fall2024"} className={styles.largeButton}>Fall 2024</button>
              <button onClick={redirectSchedule} value={"winter2025"} className={styles.largeButton}>Winter 2025</button>
            </div>

            <div className={styles.videoColumn}>   
                <Image
                 src={Video}
                 alt="Example Image"
                 className={styles.image}
                >
                </Image>
             
            </div>
          </div>
          <div className="mt-5">
            <h2 className="text-xl font-semibold ">Helpful Tools</h2>
            <hr className="mb-4 mt-2 border-gray-300" />

            <div className="grid grid-cols-2 gap-8">
              <section>
                <h3 className="text-l font-semibold">First Year Guide</h3>
                <p className="text-gray-700">
                  A recommended sequence of courses for a degree, designed by
                  the Academic Advising department to simplify schedule
                  planning. This feature is not available for all degrees.
                </p>
                <SearchDropdown></SearchDropdown>
              </section>

              <section>
                <h3 className="text-l font-semibold">
                  Academic Requirements Report
                </h3>
                <p className="text-gray-700">
                  A report comparing completed courses to degree requirements,
                  allowing students to determine which requirements have been
                  fulfilled and how many remain.
                </p>
                <a
                  href="https://university.edu/academic-requirements"
                  className="text-blue-600 hover:underline"
                >
                  https://university.edu/academic-requirements
                </a>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function SearchDropdown() {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const degrees = [
    "Biological Sciences.pdf",
    "Environmental Science.pdf",
    "Mechanical Engineering.pdf",
    "Electrical Engineering.pdf",
    "Civil Engineering.pdf",
    "Architecture.pdf",
    "Nursing.pdf",
    "Psychology.pdf",
    "Business Administration.pdf",
    "Chemical Engineering.pdf",
    "Kinesiology.pdf",
    "Mathematics.pdf",
  ];

  degrees.sort();
  

  function handleChange(e) {
    setSearch(e.target.value);
}

  return (
    <div className="pt-4">
      <label className="hidden">Degree Name</label>
      <Input 
      className="rounded-b-none focus-visible:border-input focus-visible:ring-0 focus-visible:shadow-none" 
      value={search}
      onChange={handleChange} 
      placeholder="Degree Name..." 
      onFocus={() => setIsFocused(true)}
      onBlur={() => setTimeout(() => setIsFocused(false), 100)}/>
      {isFocused && <ScrollArea className="h-72 w-48 border w-full border-input rounded-b max-h-[100px]">
        <div className="p-4">
          {degrees
            .filter((item) => item.toLowerCase().includes(search.toLowerCase()))
            .map((item, index) => (   
              <div key={index} className="text-sm border-b-2 border-input py-2">
                <a href="https://example.com/">{item}</a>
              </div>
            ))}
        </div>
      </ScrollArea>}
    </div>
  );
}

export { SearchDropdown };
