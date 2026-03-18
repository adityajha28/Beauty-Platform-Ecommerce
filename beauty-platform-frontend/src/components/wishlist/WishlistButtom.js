import { useDispatch } from "react-redux";
import { addWishlist } from "../../store/wishlistSlice";

function WishlistButton({product}){

const dispatch = useDispatch();

return(

<button

onClick={()=>dispatch(addWishlist(product))}

>

❤️

</button>

)

}

export default WishlistButton;