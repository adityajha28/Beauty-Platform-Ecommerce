import { useNavigate } from "react-router-dom";
import "./FloatingBookingButton.css";

function FloatingBookingButton(){

const navigate = useNavigate();

return(

<button

className="floating-book-btn"

onClick={()=>navigate("/services")}

>

Book Service

</button>

)

}

export default FloatingBookingButton;