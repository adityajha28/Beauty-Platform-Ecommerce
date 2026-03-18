import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function SkeletonCard(){

return(

<div className="product-card">

<Skeleton height={180}/>

<div style={{padding:"10px"}}>

<Skeleton height={20}/>
<Skeleton height={20}/>

</div>

</div>

)

}

export default SkeletonCard;