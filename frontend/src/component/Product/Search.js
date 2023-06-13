import React, { Fragment, useState } from 'react';
import "./Search.css";
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';


const Search = () => {

    const navigate=useNavigate();

    const [keyword,setKeyword]=useState("");

    const searchSubmitHandler=(e)=>{
        e.preventDefault(); //it prevents page from being reloading on submitting the form
        if(keyword.trim()){ //trim will remove the space if it is there
            navigate(`/products/${keyword}`);
        }
        else{
            navigate("/products");
        }
    };

  return (
    <Fragment>
    <MetaData title="Search a Product--ShoppingKart"/>
        <form className='searchBox' onSubmit={searchSubmitHandler}>
            <input type="text" placeholder='Search a product...' onChange={(e)=>setKeyword(e.target.value)}/>
            <input type="submit" value="Search"/>
        </form>
    </Fragment>
  )
}

export default Search
