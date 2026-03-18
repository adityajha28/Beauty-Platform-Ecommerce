import React from "react";
import "./StickyCartBar.css";

function StickyCartBar({total}){

return(

<div className="sticky-cart">

<span>Total ₹{total}</span>

<button className="btn btn-r">

Checkout

</button>

</div>

)

}

export default StickyCartBar;