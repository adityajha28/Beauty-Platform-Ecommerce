import {useState,useEffect} from "react";
import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import BookingHistory from "../../components/profile/BookingHistory";
import OrderHistory from "../../components/profile/OrderHistory";
import "./Profile.css";

function Profile(){

const [tab,setTab]=useState("bookings");

return(

<>

<Navbar/>

<section className="profile-page">

<div className="wrap">

<h1>

My Profile

</h1>

<div className="profile-tabs">

<button
className={tab==="bookings" ? "active":""}
onClick={()=>setTab("bookings")}
>

Bookings

</button>

<button
className={tab==="orders" ? "active":""}
onClick={()=>setTab("orders")}
>

Orders

</button>

</div>

{tab==="bookings" && <BookingHistory/>}

{tab==="orders" && <OrderHistory/>}

</div>

</section>

<BottomNav/>

</>

)

}

export default Profile;