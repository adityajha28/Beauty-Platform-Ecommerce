function ProductRating({rating=4}){

return(

<div className="product-rating">

{"★".repeat(rating)}

{"☆".repeat(5-rating)}

</div>

)

}

export default ProductRating