"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  AlertTriangle,
  Check,
  Pin,
  PinOff,
  ChevronDown,
  UserPlus,
  UserMinus,
  Clock,
  Info,
  Calendar,
  Copy,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import allCourses from "@/app/database/allClasses.json";

export default function SuggestedCourses({ onAddCourse }) {
  const courses = [
    allCourses[0],
    allCourses[1],
  ];
  return (
    <div className="mt-6 p-4 border rounded-md bg-muted/20">
      <h3 className="font-medium mb-2">Suggested Courses</h3>
      <p className="text-sm text-muted-foreground">
        Based on your{" "}
        <a className="underline" href="https://example.com/">
          Academic Requirements Report
        </a>
      </p>
      <div className="pt-10 flex flex-col gap-10">
        {courses.map((course) => {
          return (
            <Card key={"suggested-" + course.code} style={{ padding: "5px 0px" }}>
              <div className="text-left p-4">
                <div className="pb-5">
                  <h3 className="font-bold">{course.code}</h3>
                  <p className="text-sm text-muted-foreground">{course.title}</p>
                </div>
                <Button value={course.id} onClick={(e) => onAddCourse(e.target.value)} variant="ghost" className="text-s h-auto bg-gray-50 text-gray-700 border-gray-200 rounded-md border ">Add This Course To My Tab</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
