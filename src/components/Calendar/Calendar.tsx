import CalendarHeader from "@components/Calendar/CalendarHeader";
import CalendarEvents from "@components/Calendar/CalendarEvents";

export default function Calendar() {
    return (
        <section className="bg-gray-200 grow m-4">
            {/* <CalendarHeader></CalendarHeader> */}
            <CalendarEvents></CalendarEvents>
        </section>
    );
}
