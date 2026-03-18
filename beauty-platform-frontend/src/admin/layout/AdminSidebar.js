import {Link} from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar(){

return(

<div className="admin-sidebar">

<h2>

Bella Admin

</h2>

<Link to="/admin/dashboard">

Dashboard

</Link>

<Link to="/admin/products">

Products

</Link>

<Link to="/admin/services">

Services

</Link>

<Link to="/admin/orders">

Orders

</Link>

<Link to="/admin/bookings">

Bookings

</Link>

<Link to="/admin/users">

Users

</Link>

</div>

)

}

export default AdminSidebar