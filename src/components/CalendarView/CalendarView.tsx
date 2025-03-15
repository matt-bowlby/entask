import CalendarHeader from "@components/CalendarView/CalendarHeader";
import CalendarEvents from "@components/CalendarView/CalendarEvents";

export default function CalendarView() {
    return (
        <section className="bg-gray-200 grow-4 m-4">
            <CalendarHeader></CalendarHeader>
            <CalendarEvents></CalendarEvents>
        </section>
    );
}
