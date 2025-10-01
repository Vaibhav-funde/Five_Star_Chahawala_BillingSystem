import React from "react";
import { Link } from "react-router-dom";

function Menu1() {
  return (
    <div>
      <section className="featured-chai">
        <div className="nav-bar">
          <div className="nav-title">Menu</div>
          <h1 className="bill-btn">Add</h1>
        </div>
        <h2>Our Special Chai Varieties</h2>
        <div className="chai-container">

          <div className="chai-card">
            <img src="Images/MasalaChai.jpg" alt="Masala Chai" />
            <h3>Masala Chai</h3>
            <h4>R10</h4>
            <p>Aromatic blend of spices with a strong tea base.</p>
            <a href="#" className="btn order-btn">Add</a>
          </div>


        </div>
      </section>
    </div>
  );
}

export default Menu1;
