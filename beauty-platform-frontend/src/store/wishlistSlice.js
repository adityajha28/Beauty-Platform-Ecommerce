import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({

name:"wishlist",

initialState:{
items:[]
},

reducers:{

addWishlist:(state,action)=>{
state.items.push(action.payload);
},

removeWishlist:(state,action)=>{
state.items = state.items.filter(i=>i.id!==action.payload);
}

}

});

export const {addWishlist,removeWishlist} = wishlistSlice.actions;

export default wishlistSlice.reducer;