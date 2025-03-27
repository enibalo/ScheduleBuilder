'use client'
import { useState } from "react";
import styles from "./Home.module.css"; 
import { AppHeader } from "../components/app-header";

export default function Homepage() {
  return (
    <>
    <AppHeader></AppHeader>
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.buttonColumn}>
            <button className={styles.largeButton}>
              Spring 2025
            </button>
            <button className={styles.largeButton}>
              Summer 2025
            </button>
            <button className={styles.largeButton}>
              Fall 2025
            </button>
            <button className={styles.largeButton}>
              Winter 2026
            </button>
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
      </main>
      <div>
        <div>
          <h2>Helpful Tools</h2>
          <ToolIcon></ToolIcon>
        </div>
        <line></line>
        <section>
          <h3>First Year Guide</h3>
          <p>
            A recommended sequence of courses for a degree, designed by the
            Academic Advising department to simplify schedule planning. This
            feature is not available for all degrees.
          </p>
        </section>
        <section>
          <h3>Academic Requirements Report</h3>
          <p>
            A report comparing completed courses to degree requirements,
            allowing students to determine which requirements have been
            fulfilled and how many remain.
          </p>
          <a>https://university.edu/academic-requirements</a>
        </section>
      </div>
    </div>
    </>
  );
}