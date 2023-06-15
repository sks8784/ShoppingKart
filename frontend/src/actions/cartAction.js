import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from "../constants/cartConstants";
import axios from "axios";


// Add to Cart Action
export const addItemsToCart=(id, quantity)=>async(dispatch,getState)=>{

        
        const {data}=await axios.get(`/api/v1/product/${id}`);
        const user=getState().user.user;
        

        dispatch({ 
            type:ADD_TO_CART, 
            payload:{
                userID:user._id,
                product:data.product._id,
                name:data.product.name,
                price:data.product.price,
                image:data.product.images[0].url,
                stock:data.product.Stock,
                quantity,
            },
        });

        localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems));// getState helps to get the current state of cart
    
};


// Remove from Cart Action
export const removeItemsFromCart=(productID, userID)=>async(dispatch,getState)=>{
    dispatch({
        type:REMOVE_CART_ITEM,
        payload:{
            product:productID,
            userID:userID,
        },
    });

    localStorage.setItem("cartItems",JSON.stringify(getState().cart.cartItems));// getState helps to get the current state of cart
};


// Save Shipping Info Action
export const saveShippingInfo=(data)=>async(dispatch)=>{
    dispatch({
        type:SAVE_SHIPPING_INFO,
        payload:data,
    });

    localStorage.setItem("shippingInfo",JSON.stringify(data));
};