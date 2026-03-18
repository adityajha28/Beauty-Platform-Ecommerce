import { useState } from "react";

function useSwipe(onLeft,onRight){

const [touchStart,setTouchStart] = useState(null);

const handleTouchStart = (e)=>{

setTouchStart(e.targetTouches[0].clientX);

};

const handleTouchEnd = (e)=>{

const touchEnd = e.changedTouches[0].clientX;

if(touchStart - touchEnd > 50){

onLeft();

}

if(touchEnd - touchStart > 50){

onRight();

}

};

return{

onTouchStart:handleTouchStart,
onTouchEnd:handleTouchEnd

}

}

export default useSwipe;