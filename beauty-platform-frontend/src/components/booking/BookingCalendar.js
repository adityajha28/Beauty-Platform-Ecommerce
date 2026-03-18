import Calendar from "react-calendar";

function BookingCalendar({onDateSelect}){

return(

<Calendar onChange={onDateSelect}/>

)

}

export default BookingCalendar;