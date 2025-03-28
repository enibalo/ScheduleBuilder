"use client";
import { useState } from "react";
import styles from "./Home.module.css";
import { AppHeader } from "../components/app-header";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function Homepage() {
  return (
    <>
      <AppHeader></AppHeader>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.buttonColumn}>
              <button className={styles.largeButton}>Spring 2025</button>
              <button className={styles.largeButton}>Summer 2025</button>
              <button className={styles.largeButton}>Fall 2025</button>
              <button className={styles.largeButton}>Winter 2026</button>
            </div>

            <div className={styles.videoColumn}>
              <div className={styles.imageContainer}>
                <img
                  src="./video.jpg"
                  alt="Example Image"
                  className={styles.image}
                />
              </div>
            </div>
          </div>
          <div className="p-6 mt-4">
            <h2 className="text-2xl font-bold">Helpful Tools</h2>
            <hr className="my-4 border-gray-300" />

            <div className="grid grid-cols-2 gap-8">
              <section>
                <h3 className="text-xl font-semibold">First Year Guide</h3>
                <p className="text-gray-700">
                  A recommended sequence of courses for a degree, designed by
                  the Academic Advising department to simplify schedule
                  planning. This feature is not available for all degrees.
                </p>
                <SearchDropdown></SearchDropdown>
              </section>

              <section>
                <h3 className="text-xl font-semibold">
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

  return (
    <div>
      <label className="hidden">Program Name</label>
      <Input value={search} onValueChange={setSearch} placeholder="Search..." />
      <ScrollArea className="hidden">
        <div className="p-4">
          {degrees
            .filter((item) => item.toLowerCase().includes(search.toLowerCase()))
            .map((item, index) => (
              <div key={index}>
                <a href="https://example.com/">{item}</a>
              </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export { SearchDropdown };
