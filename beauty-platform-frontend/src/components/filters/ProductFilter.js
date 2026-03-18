import { useState } from "react";
import "./ProductFilters.css";

function ProductFilters({ onFilter }) {

const [category,setCategory] = useState("");
const [brand,setBrand] = useState("");
const [price,setPrice] = useState("");

const applyFilter = () => {

onFilter({
category,
brand,
price
});

};

return(

<div className="product-filters">

<select onChange={(e)=>setCategory(e.target.value)}>

<option value="">All Categories</option>
<option value="skincare">Skincare</option>
<option value="haircare">Haircare</option>
<option value="makeup">Makeup</option>

</select>

<select onChange={(e)=>setBrand(e.target.value)}>

<option value="">All Brands</option>
<option value="loreal">Loreal</option>
<option value="maybelline">Maybelline</option>
<option value="lakme">Lakme</option>

</select>

<select onChange={(e)=>setPrice(e.target.value)}>

<option value="">All Prices</option>
<option value="500">Below ₹500</option>
<option value="1000">Below ₹1000</option>
<option value="2000">Below ₹2000</option>

</select>

<button onClick={applyFilter} className="btn btn-r">

Apply Filters

</button>

</div>

)

}

export default ProductFilters;