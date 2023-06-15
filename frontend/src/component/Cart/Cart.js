import React, { Fragment } from 'react';
import "./Cart.css";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartAction';
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    // console.log(user._id);


    const increaseQuantity = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (stock <= quantity) {
            return;
        }
        dispatch(addItemsToCart(id, newQty));
    }

    const decreaseQuantity = (id, quantity) => {
        const newQty = quantity - 1;
        if (quantity <= 1) {
            return;
        }
        dispatch(addItemsToCart(id, newQty));
    }

    const deleteCartItems = (productID, userID) => {
        dispatch(removeItemsFromCart(productID, userID));
    }

    const checkoutHandler = () => {
        navigate("/login?redirect=/shipping");
    }

    const checkUserCartExists=()=>{
        let length=0;
        user && cartItems.forEach((item)=>{
            if(user._id === item.userID){
                length+=1;
            }
        })
        if(length>0)
        return true;
        else 
        return false;
    }

    return (
        <Fragment>
            {!checkUserCartExists() ? (
                <div className='emptyCart'>
                    <RemoveShoppingCartIcon />
                    <Typography>No Products in Your Cart</Typography>
                    <Link to="/products">View Products</Link>
                </div>
            ) : (
                <Fragment>
                    <div className='cartPage'>
                        <div className='cartHeader'>
                            <p>Product</p>
                            <p>Quantity</p>
                            <p>Subtotal</p>
                        </div>

                        {user && cartItems && cartItems.map((item) => {
                            if (user._id === item.userID) {
                                return (
                                    <div className='cartContainer' key={item.product}>
                                        <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                                        <div className='cartInput'>
                                            <button onClick={() => decreaseQuantity(item.product, item.quantity)}>-</button>
                                            <input type="number" value={item.quantity} readOnly />
                                            <button onClick={() => increaseQuantity(item.product, item.quantity, item.stock)}>+</button>
                                        </div>
                                        <p className='cartSubtotal'>{`₹${item.price * item.quantity}`}</p>
                                    </div>
                                )
                            }
                            return null;

                        })}

                        <div className='cartGrossTotal'>
                            <div></div>
                            <div className='cartGrossTotalBox'>
                                <p>Gross Total</p>
                                <p>{`₹${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)}`}</p>
                                {/* the cartItems.reduce will apply the specific function written inside reduce to all the items present in cartItems....Here 0 is the initial value of acc */}
                            </div>
                            <div></div>
                            <div className='checkOutBtn'>
                                <button onClick={checkoutHandler}>Check Out</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
            }
        </Fragment>
    )
}

export default Cart
