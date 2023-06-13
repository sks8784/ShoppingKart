import React from "react";
import './App.css';
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import WebFont from "webfontloader";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Product";
import Search from "./component/Product/Search";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import Payment from "./component/Cart/Payment";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard";
import ProductList from "./component/Admin/ProductList";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import { useState, useEffect } from "react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";



function App() {

  const { isAuthenticated, user } = useSelector(state => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
  
    const { data } = await axios.get("/api/v1/stripeapikey"); //getting Stripe Api Key from backend

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {

    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      },
    });

    store.dispatch(loadUser());

    if(isAuthenticated){
      getStripeApiKey();
    }
    

  }, []);

  // window.addEventListener("contextmenu",(e)=>e.preventDefault()); // using this no one now do right-click and inspect ..basically right-click will not work in the site

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route exact path="/" Component={Home} />

        <Route exact path="/product/:id" Component={ProductDetails} />

        <Route exact path="/products" Component={Products} />

        <Route path="/products/:keyword" Component={Products} />

        <Route exact path="/search" Component={Search} />

        {/* <Route exact path="/account" Component={Profile} /> */}
        {/* <Route path="/account" Component={ProtectedRoute}>
        <Route exact path='/account' Component={Profile}/>
        </Route> */}
        <Route exact path="/account" element={<ProtectedRoute element={<Profile />} />} />

        <Route exact path="/me/update" element={<ProtectedRoute element={<UpdateProfile />} />} />

        <Route exact path="/password/update" element={<ProtectedRoute element={<UpdatePassword />} />} />

        <Route exact path="/password/forgot" Component={ForgotPassword} />

        <Route exact path="/password/reset/:token" Component={ResetPassword} />

        <Route exact path="/login" Component={LoginSignUp} />

        <Route exact path="/cart" Component={Cart} />

        <Route exact path="/shipping" element={<ProtectedRoute element={<Shipping />} />} />
       
        <Route exact path="/order/confirm" element={<ProtectedRoute element={<ConfirmOrder />} />} />

        {stripeApiKey && (
          <Route
            exact path="/process/payment"
            element={
              <Elements stripe={loadStripe(stripeApiKey)}>
                <ProtectedRoute element={<Payment />} />
              </Elements>
            }
          />
        )}

        <Route exact path="/success" element={<ProtectedRoute element={<OrderSuccess />} />} />

        <Route exact path="/orders" element={<ProtectedRoute element={<MyOrders />} />} />

        <Route exact path="/order/:id" element={<ProtectedRoute element={<OrderDetails />} />} />

        <Route  exact path="/admin/dashboard" element={<ProtectedRoute isAdmin={true} element={<Dashboard />} />} />
      
        <Route  exact path="/admin/products" element={<ProtectedRoute isAdmin={true} element={<ProductList />} />} />

        <Route  exact path="/admin/product" element={<ProtectedRoute isAdmin={true} element={<NewProduct />} />} />

        <Route  exact path="/admin/product/:id" element={<ProtectedRoute isAdmin={true} element={<UpdateProduct />} />} />

        <Route  exact path="/admin/orders" element={<ProtectedRoute isAdmin={true} element={<OrderList />} />} />

        <Route  exact path="/admin/order/:id" element={<ProtectedRoute isAdmin={true} element={<ProcessOrder />} />} />
        
        <Route  exact path="/admin/order/:id" element={<ProtectedRoute isAdmin={true} element={<ProcessOrder />} />} />

        <Route  exact path="/admin/users" element={<ProtectedRoute isAdmin={true} element={<UsersList />} />} />

        <Route  exact path="/admin/user/:id" element={<ProtectedRoute isAdmin={true} element={<UpdateUser />} />} />

        <Route  exact path="/admin/reviews" element={<ProtectedRoute isAdmin={true} element={<ProductReviews />} />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
