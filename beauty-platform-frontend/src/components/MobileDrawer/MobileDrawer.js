import {Link} from "react-router-dom";
import "./MobileDrawer.css";

function MobileDrawer({open,setOpen}){

return(

<div className={`drawer ${open ? "show" : ""}`}>

<button
className="drawer-close"
onClick={()=>setOpen(false)}
>

✕

</button>

<Link to="/" onClick={()=>setOpen(false)}>
Home
</Link>

<Link to="/services" onClick={()=>setOpen(false)}>
Services
</Link>

<Link to="/products" onClick={()=>setOpen(false)}>
Products
</Link>

<Link to="/careers" onClick={()=>setOpen(false)}>
Careers
</Link>

<Link to="/login" onClick={()=>setOpen(false)}>
Login
</Link>

</div>

)

}

export default MobileDrawer;