import { Toaster } from "react-hot-toast";

function NotificationProvider(){

return(

<Toaster
position="top-right"
toastOptions={{
style:{
background:"#333",
color:"#fff"
}
}}
/>

)

}

export default NotificationProvider;