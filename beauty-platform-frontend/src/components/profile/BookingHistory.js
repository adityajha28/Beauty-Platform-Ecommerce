import {useEffect,useState} from "react";
import {getUserBookings} from "../../services/bookingService";

function BookingHistory(){

const [bookings,setBookings]=useState([]);

useEffect(()=>{

loadBookings();

},[])

const loadBookings=async()=>{

const res=await getUserBookings();

setBookings(res.data);

}

return(

<div className="booking-history">

{bookings.map(b=>(

<div
className="booking-card"
key={b.id}
>

<h3>

{b.serviceName}

</h3>

<p>

Date: {b.date}

</p>

<p>

Status: {b.status}

</p>

</div>

))}

</div>

)

}

export default BookingHistory;