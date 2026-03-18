import { useCart } from "../../context/CartContext";

function StickyAddToCart({product}){

const {addToCart} = useCart();

return(

<div className="sticky-add-cart">

<span>₹{product.price}</span>

<button

className="btn btn-r"

onClick={()=>addToCart(product)}

>

Add To Cart

</button>

</div>

)

}

export default StickyAddToCart