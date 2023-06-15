import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from "../constants/cartConstants";


export const cartReducer = (state = { cartItems: [], shippingInfo: {} }, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload;

            const isItemExist = state.cartItems.find(
                (i) => (i.product === item.product && i.userID === item.userID) //here product is actually product id...refer to the dispatch of cartAction
            );

            // const isUserExist = state.cartItems.find(
            //     (i) => i.userID === item.userID //here product is actually product id...refer to the dispatch of cartAction
            // );

            if (isItemExist) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((i) =>
                        i.product === isItemExist.product ? item : i,

                    )
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                };
            }

        case REMOVE_CART_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter((i) => (i.product !== action.payload.product || i.userID !== action.payload.userID)), //filter method will keep all the cartItems except the one whose id is passed in action.payload 
            }

        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload,
            }


        default:
            return state;
    }
}