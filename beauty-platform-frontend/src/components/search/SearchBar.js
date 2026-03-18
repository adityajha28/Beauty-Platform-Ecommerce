import { useState } from "react";

function SearchBar({onSearch}){

const [query,setQuery]=useState("");

return(

<input

placeholder="Search products..."

value={query}

onChange={e=>{

setQuery(e.target.value);
onSearch(e.target.value);

}}

/>

)

}

export default SearchBar;