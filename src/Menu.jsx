// import React, { useEffect } from "react";
// import img from './Images/Logo.png'
// import img1 from './Images/MasalaChai.jpg'
// import img2 from './Images/Gingerchai.jpg'
// import img3 from './Images/TulsiChai.jpg'
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";



// function Menu(menulist) {
//   const navigate = useNavigate();

//    useEffect(() => {
//     console.log("Menu component mounted or updated.");
//   }, [menulist]);

//   const renderlist =({menulist})=>{
//     if(menulist){
//       return menulist.map((value)=>{
//         return (
//           <div >
//             <div key={value.id} className="chai-card">
//             <img src={value.image} alt="Masala Chai" />
//             <h3>{value.name}</h3>
//             <h4>{value.price}</h4>
//             <p>{value.description}</p><br />
//            <Link
//              to="/chaid"
//              state={value}
//              className="btn order-btn"> Add
//           </Link>
            
//             </div>
//           </div>
//         )
//       })
//     }
//   } 

  
//   return (
//     <div>
      

//       {/* Menu Section */}
//       <section className="featured-chai">
//         <div className="nav-bar">
//           <div className="nav-title">Manu</div>
//           <h1 className="bill-btn">Add-To-Cart</h1>
//         </div>
//         <h2>Our Special Chai Varieties</h2>
//         <div className="chai-container">

//           {/* Repeat this block for each chai item */}
          
//            {renderlist(menulist)}


//         </div>
//       </section>

      
//     </div>
//   );
// }

// export default Menu;

//json data
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Menu() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    axios.get('http://localhost:5000/Item')
      .then(res => {
        setProducts(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  useEffect(() => {
  let updated = [...products];

  // Search filter
  if (searchTerm) {
    updated = updated.filter(product =>
      (product?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Category filter
  if (filterType !== "All") {
    updated = updated.filter(product =>
      (product?.category || "").toLowerCase() === filterType.toLowerCase()
    );
  }

  // Sorting
  if (sortOrder === "asc") {
    updated.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc") {
    updated.sort((a, b) => b.price - a.price);
  }

  setFiltered(updated);
}, [searchTerm, filterType, sortOrder, products]);


  const renderCards = () => {
    if (filtered.length === 0) {
      return <p>No products found.</p>;
    }

    return filtered.map(product => (
      <div key={product.id} className="chai-card">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <h4>₹{product.price}</h4>
        <p>{product.description}</p><br />
        <Link to="/chaid" state={product} className="btn order-btn">Add</Link>
      </div>
    ));
  };

  return (
    


    <div className="container">
      <h2> Menu List</h2>

      {/* Controls */}
      <div className="controls" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="Chai">Chai</option>
          <option value="Coffee">Coffee</option>
          <option value="Bun">Bun</option>
          <option value="Cold Drinks">Cold Drinks</option>
          <option value="Snacks">Snacks</option>
          <option value="Juice Bar">Juice Bar</option>
          <option value="Ice Cream">Ice Cream</option>
        </select>

        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="default">Sort by Price</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="chai-container">
        {renderCards()}
      </div>
    </div>
  );
}

export default Menu;



