import { useSelector } from "react-redux";
import ProductCard from "../../components/cards/ProductCard";
import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";

function Wishlist(){

const wishlist = useSelector(state=>state.wishlist.items);

return(

<>

<Navbar/>

<section className="section">

<div className="wrap">

<h1>My Wishlist</h1>

<div className="products-grid">

{wishlist.map(product=>(

<ProductCard key={product.id} product={product}/>

))}

</div>

</div>

</section>

<BottomNav/>

</>

)

}

export default Wishlist;