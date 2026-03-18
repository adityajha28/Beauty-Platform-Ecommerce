import {useState,useEffect} from "react";
import {getUserOrders} from "../../services/orderService";

function OrderHistory(){

const [orders,setOrders]=useState([]);

useEffect(()=>{

loadOrders();

},[])

const loadOrders=async()=>{

const res=await getUserOrders();

setOrders(res.data);

}

return(

<div className="order-history">

{orders.map(order=>(

<div
key={order.id}
className="order-card"
>

<h3>

Order #{order.id}

</h3>

<p>

Total: ₹{order.total}

</p>

<p>

Status: {order.status}

</p>

</div>

))}

</div>

)

}

export default OrderHistory