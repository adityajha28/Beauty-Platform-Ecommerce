import { Modal } from "react-bootstrap";

function QuickViewModal({product,show,onClose}){

if(!product) return null;

return(

<Modal show={show} onHide={onClose} centered>

<Modal.Body>

<img src={product.image} alt={product.name} style={{width:"100%"}}/>

<h3>{product.name}</h3>

<p>{product.description}</p>

<p>₹{product.price}</p>

</Modal.Body>

</Modal>

)

}

export default QuickViewModal