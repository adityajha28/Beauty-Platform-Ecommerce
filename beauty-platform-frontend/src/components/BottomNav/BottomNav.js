import {NavLink} from "react-router-dom";
import "./BottomNav.css";
import { motion } from "framer-motion";

function BottomNav(){

return(

<nav className="bottom-nav">

<NavLink to="/">

🏠
<span>Home</span>

</NavLink>

<NavLink to="/services">

💄
<span>Services</span>

</NavLink>

<NavLink to="/products">

🛍
<span>Shop</span>

</NavLink>
<motion.div whileTap={{scale:0.85}}>
<NavLink to="/cart">

🛒
<span>Cart</span>

</NavLink>

</motion.div>

<NavLink to="/profile">

👤
<span>Profile</span>

</NavLink>

</nav>

)

}

export default BottomNav;