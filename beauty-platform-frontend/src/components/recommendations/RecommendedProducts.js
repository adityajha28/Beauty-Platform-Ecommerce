import { useEffect, useState } from "react";
import ProductCard from "../cards/ProductCard";
import productService from "../../services/productService";

function RecommendedProducts(){

const [products,setProducts] = useState([]);

useEffect(()=>{

loadRecommendations();

},[]);

const loadRecommendations = async () => {

const res = await productService.getProducts();

const shuffled = res.data.sort(()=>0.5-Math.random());

setProducts(shuffled.slice(0,4));

};

return(

<div className="recommended-section">

<h2>Recommended For You</h2>

<div className="products-grid">

{products.map(product => (

<ProductCard key={product.id} product={product}/>

))}

</div>

</div>

)

}

export default RecommendedProducts;