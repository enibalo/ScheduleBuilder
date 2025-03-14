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
    </div>
    </>
  );
}