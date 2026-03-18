import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": require("date-fns/locale/en-US") };

const localizer = dateFnsLocalizer({
format,
parse,
startOfWeek,
getDay,
locales
});

function BookingCalendar({ bookings }) {

const events = bookings.map(b => ({
title: b.serviceName,
start: new Date(b.date),
end: new Date(b.date)
}));

return (

<Calendar
localizer={localizer}
events={events}
startAccessor="start"
endAccessor="end"
style={{ height: 500 }}
/>

);

}

export default BookingCalendar;