import {useEffect,useState} from "react";
import AdminLayout from "../../layout/AdminLayout";
import "./Dashboard.css";

function Dashboard(){

const [stats,setStats]=useState({

users:0,
orders:0,
revenue:0,
bookings:0

});

useEffect(()=>{

// later fetch from API

setStats({

users:1200,
orders:340,
revenue:580000,
bookings:150

});

},[])

return(

<AdminLayout>

<div className="admin-stats">

<div className="stat-card">

<h3>

Users

</h3>

<p>

{stats.users}

</p>

</div>

<div className="stat-card">

<h3>

Orders

</h3>

<p>

{stats.orders}

</p>

</div>

<div className="stat-card">

<h3>

Bookings

</h3>

<p>

{stats.bookings}

</p>

</div>

<div className="stat-card">

<h3>

Revenue

</h3>

<p>

₹{stats.revenue}

</p>

</div>

</div>

</AdminLayout>

)

}

export default Dashboard;