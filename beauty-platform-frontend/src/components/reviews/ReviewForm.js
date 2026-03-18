import {useState} from "react";
import {createReview} from "../../services/reviewService";

function ReviewForm({productId}){

const [rating,setRating]=useState(5);
const [comment,setComment]=useState("");

const submit=async()=>{

await createReview({

productId,
rating,
comment

});

alert("Review submitted");

}

return(

<div className="review-form">

<select
value={rating}
onChange={e=>setRating(e.target.value)}
>

<option value="5">5 ⭐</option>
<option value="4">4 ⭐</option>
<option value="3">3 ⭐</option>

</select>

<textarea
placeholder="Write review"
value={comment}
onChange={e=>setComment(e.target.value)}
/>

<button
className="btn btn-r"
onClick={submit}
>

Submit Review

</button>

</div>

)

}

export default ReviewForm