import { useCart } from "../../context/CartContext";
import "./CartDrawer.css";

function CartDrawer({open,onClose}){

const {cartItems,removeFromCart} = useCart();

return(

<div className={`cart-drawer ${open ? "show":""}`}>

<div className="cart-header">

<h3>Your Cart</h3>

<button onClick={onClose}>✕</button>

</div>

<div className="cart-items">

{cartItems.map(item=>(

<div key={item.id} className="cart-item">

<img src={item.image} alt={item.name}/>

<div>

<h4>{item.name}</h4>
<p>₹{item.price}</p>

<button onClick={()=>removeFromCart(item.id)}>

Remove

</button>

</div>

</div>

))}

</div>

</div>

)

}

export default CartDrawer