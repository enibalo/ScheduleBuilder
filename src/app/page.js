import Image from "next/image";
import GetSchedule from "./pages/GetSchedule";
import MainPage from "./components/SavedSchedules";
import Homepage from "./pages/Home";
import ScheduleBuilder from "./pages/ScheduleBuilder";

export default function Home() {
  return (
    <ScheduleBuilder></ScheduleBuilder>
  );
}
