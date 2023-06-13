import React from 'react';
import "./Footer.css"
import playStore from "../../../images/playstore.png"
import appStore from "../../../images/appstore.png"

const Footer = () => {
  return (
    <footer id="footer">
        <div className='leftFooter'>
            <h4>DOWNLOAD OUR APP</h4>
            <p>Downlaod App for Android and IOS mobile phone</p>
            <img src={playStore} alt="playstore"/>
            <img src={appStore} alt="Appstore"/>
        </div>

        <div className='midFooter'>
            <h1>Shopping Kart</h1>
            <p>High Quality is our first priority</p>
            <p>Copyrights 2023 &copy; Shubham</p>
        </div>

        <div className='rightFooter'>
            <h4>Follow Us</h4>
            <a href="">Instagram</a>
            <a href="">Facebook</a>
            <a href="">Twitter</a>
        </div>
    </footer>
  )
}

export default Footer
