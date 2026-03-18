import ProductCard from "../../components/cards/ProductCard";
import "./ProductsSection.css";

function ProductsSection(){

const products=[

{
id:1,
name:"Vitamin C Serum",
price:899,
image:"/images/product1.jpg"
},

{
id:2,
name:"Luxury Face Cream",
price:1299,
image:"/images/product2.jpg"
},

{
id:3,
name:"Hair Repair Oil",
price:699,
image:"/images/product3.jpg"
},

{
id:4,
name:"Makeup Kit",
price:2499,
image:"/images/product4.jpg"
}

]

return(

<section className="section products">

<div className="wrap">

<h2 className="section-title">

Featured Products

</h2>

<div className="products-grid">

{products.map(product=>(

<ProductCard
key={product.id}
product={product}
/>

))}

</div>

</div>

</section>

)

}

export default ProductsSection;