import CalendarDays from "@/components/CalendarView/CalendarDays/CalendarDays";
import CalendarHeader from "@components/CalendarView/CalendarHeader";
import CalendarHours from "@components/CalendarView/CalendarHours";

export default function CalendarView() {
    return (
        <section className="bg-gray-200 grow-4">
            <CalendarHeader></CalendarHeader>
            <CalendarDays></CalendarDays>
            <CalendarHours></CalendarHours>
        </section>
    );
}
