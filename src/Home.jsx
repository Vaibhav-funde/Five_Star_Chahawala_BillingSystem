import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import img1 from './Images/MasalaChai.jpg'
import img2 from './Images/Gingerchai.jpg'
import img3 from './Images/TulsiChai.jpg'
import img4 from './Images/Buy1.jpg'
import img5 from './Images/Combo.jpg'
import img6 from './Images/Discount.jpg'
import img7 from './Images/Enjoy.jpg'
import img9 from './Images/Select.jpg'
import img8 from './Images/OrderOnline.jpg'

function Home() {
    const [ads, setAds] = useState([]);
    const [showAd, setShowAd] = useState(true); // 

    useEffect(() => {
  axios.get("http://localhost:8081/api/ads/active")
    .then(res => setAds(res.data));
}, []);

    return (
        <div>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="Hedline">Hot & Delicious!</h1>
                    <p className="Hedline">Chai time in Pathardi - the perfect way to beat the chill!.</p>
                    <div className="buttons">
                        <Link to="/cart" className="order-btns">Order Now</Link>
                        <Link to="/menu" className="order-btns">View Menu</Link>
                    </div>
                </div>
            </section>

            {/* Featured Chai Section */}
            <section className="featured-chai">
                <h2>Our Special Chai Varieties</h2>
                <div className="chai-container">
                    <div className="chai-card">
                        <img src={img1} alt="Masala Chai"/>
                        <h3 className="item">Masala Chai</h3>
                        <p>Aromatic blend of spices with a strong tea base.</p><br/>
                        <Link to="/cart" className="btn order-btn">Order Now</Link>
                    </div>
                    <div className="chai-card">
                        <img src={img2} alt="Ginger Chai"/>
                        <h3>Ginger Chai</h3>
                        <p>Soothing and spicy ginger-infused chai.</p><br/>
                        <Link to="/cart" className="btn order-btn">Order Now</Link>
                    </div>
                    <div className="chai-card">
                        <img src={img3} alt="Tulsi Chai"/>
                        <h3>Tulsi Chai</h3>
                        <p>Refreshing herbal chai with holy basil essence.</p><br/>
                        <Link to="/cart" className="btn order-btn">Order Now</Link>
                    </div>
                </div>
            </section>

           {showAd && ads.map(ad => (
  <section className="advertisement" key={ad.id}>
    <div className="ad-container">

      {ad.mediaType === "IMAGE" ? (
        <img
          src={`http://localhost:8081${ad.mediaUrl}`}
          alt={ad.title}
          className="ad-bg"
        />
      ) : (
       <video autoPlay muted loop className="ad-bg ad-video">
  <source src={`http://localhost:8081${ad.mediaUrl}`} />
</video>
      )}

      <div className="ad-text">
        <h2>{ad.title}</h2>
        <p>{ad.description}</p>
      </div>

      <button className="close-btn" onClick={() => setShowAd(false)}>✖</button>
    </div>
  </section>
))}




            {/* Special Offers Section */}
            <section className="special-offers">
                <h2>🔥 Special Offers & Deals</h2>
                <div className="offers-container">
                    <div className="offer-card">
                        <img src={img4} alt="Buy 1 Get 1 Free"/>
                        <h3>Buy 1 Get 1 Free</h3>
                        <p>Order any large chai and get another one absolutely free!</p>
                        <Link to="/" className="btn">Claim Offer</Link>
                    </div>
                    <div className="offer-card">
                        <img src={img5} alt="Combo Deal"/>
                        <h3>Chai + Snacks Combo</h3>
                        <p>Get a delicious chai and a snack for just $5.99.</p>
                        <Link to="/" className="btn">Grab Now</Link>
                    </div>
                    <div className="offer-card">
                        <img src={img6} alt="20% Off"/>
                        <h3>20% Off Online Orders</h3>
                        <p>Enjoy 20% off on all online chai orders this weekend!</p>
                        <Link to="/cart" className="btn">Order Now</Link>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <h2>☕ How It Works</h2>
                <div className="steps-container">
                    <div className="step">
                        <img src={img7} alt="Select Your Chai"/>
                        <h3>1. Select Your Chai</h3>
                        <p>Choose from our variety of delicious chai flavors.</p>
                    </div>
                    <div className="step">
                        <img src={img8} alt="Order Online"/>
                        <h3>2. Place Your Order</h3>
                        <p>Order online with just a few clicks and customize your chai.</p>
                    </div>
                    <div className="step">
                        <img src={img9} alt="Enjoy"/>
                        <h3>3. Enjoy Your Chai</h3>
                        <p>Relax and enjoy your freshly brewed chai, delivered to you.</p>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Home;
