import { useRef } from "react";

function OTPInput({ otp, setOtp }) {

const inputs = useRef([]);

const handleChange = (value, index) => {

if(!/^[0-9]?$/.test(value)) return;

const newOtp = [...otp];
newOtp[index] = value;
setOtp(newOtp);

if(value && index < 5){
inputs.current[index+1].focus();
}

};

return(

<div className="otp-container">

{otp.map((digit,index)=>(
<input
key={index}
className="otp-input"
value={digit}
maxLength={1}
ref={(el)=>inputs.current[index]=el}
onChange={(e)=>handleChange(e.target.value,index)}
/>
))}

</div>

)

}

export default OTPInput;