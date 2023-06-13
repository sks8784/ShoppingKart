import React from 'react';
import { ReactNavbar } from "overlay-navbar";
import { FaUser } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import logo from  "../../../images/ShoppingKart.png";


const options = {
  burgerColorHover:"#eb4034",
  logo,
  logoWidth:"20vmax",
  navColor1:"white",
  logoHoverSize:"10px",
  link1Text:"Home",
  link2Text:"Products",
  link3Text:"Contact",
  link4Text:"About",
  link1Url:"/",
  link2Url:"/products",
  link3Url:"/contact",
  link4Url:"/about",
  link1Size:"1.3vmax",
  link1Color:"rgba(35,35,35,0.8)",
  nav1justifyContent:"flex-end",
  nav2justifyContent:"flex-end",
  nav3justifyContent:"flex-start",
  nav4justifyContent:"flex-start",
  link1ColorHover:"#eb4034",
  link1Margin:"1vmax",
  profileIcon:true,
  profileIconUrl:"/login",
  ProfileIconElement: FaUser,
  profileIconColor:"rgba(35,35,35,0.8)",
  searchIcon:true,
  SearchIconElement: FaSearch ,
  searchIconColor:"rgba(35,35,35,0.8)",
  cartIcon:true,
  CartIconElement: FaCartPlus,
  cartIconColor:"rgba(35,35,35,0.8)",
  profileIconColorHover:"#eb4034",
  searchIconColorHover:"#eb4034",
  cartIconColorHover:"#eb4034",
  cartIconMargin:"1vmax",
}
const Header = () => {
  return (
    <ReactNavbar {...options} />
  )
}

export default Header
