import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './Home';
import Header from './Header';

import About from './About';
import Contact from './Contact';
import Login from './Login';
import Footer from './Footer';
import Signup from './Signup';
import Chaidetail from './Chaidetail';
import UserNotFound from './UserNotFound';
import MenuList from './MenuList';
import Addcart from './Addcart';
import Rating from './Rating';
import OrderCheck from './OrderCheck';
import UserOrderHistory from './UserOrderHistory';
import Bill from './Bill';
import AddMenu from './AddMenu';
import UpdateMenuItem from './UpdateMenuItem';
import MenuTable from './MenuTable';
import OrderSucess from './OrderSucess';
import Crud from './Crud';
import AddItem from './AddItem';
import ItemList from './ItemList';
import TodaySale from './TodaySale';
import UpdateItem from './UpdateItem';
import DeleteItem from './DeleteItem';
import TotalUsers from './TotalUsers';
import CustomerMsg from './CustomerMsg';
import ForgotPassword from './ForgotPassword';
import AllUsers from './AllUsers';
import EditCategory from './EditCategory';
import AddCategory from './AddCategory';
import ViewCategory from './ViewCategory';
import Sidebar from "./Sidebar";
import AddAdvertisement from './AddAdvertisement';
import CompletedOrders from './CompletedOrders';
import AdminLogin from "./AdminLogin";
import ManageAdvertisements from './ManageAdvertisements';

function App() {
  const role = localStorage.getItem("role");  // ✅ Get role here

  return (
    <Router>

      {/* Header show only for normal users */}
      {role !== "admin" &&<Header />}

      {/* Sidebar show only for admin */}
      {role === "admin" && <Sidebar />}

      {/* Content area shifts right only for admin */}
      <div className={role === "admin" ? "content-with-sidebar" : ""}>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuList />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chaid" element={<Chaidetail />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/cart" element={<Addcart />} />
          <Route path="/hotel-dashboard" element={<OrderCheck />} />
          <Route path="/myorders" element={<UserOrderHistory />} />
          <Route path="/bill" element={<Bill />} />
          <Route path="/addmenu" element={<AddMenu />} />
          <Route path="/update" element={<UpdateMenuItem />} />
          <Route path="/table" element={<MenuTable />} />
          <Route path="/success" element={<OrderSucess />} />
          <Route path="/crud" element={<Crud />} />
          <Route path="/additem" element={<AddItem />} />
          <Route path="/itemlist" element={<ItemList />} />
          <Route path="/updateitem/:id" element={<UpdateItem />} />
          <Route path="/deleteitem" element={<DeleteItem />} />
          <Route path="/sales" element={<TodaySale />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/customermsg" element={<CustomerMsg />} />
          <Route path="/total" element={<TotalUsers />} />
          <Route path="/allusers" element={<AllUsers />} />
          <Route path="/addcategory" element={<AddCategory />} />
          <Route path="/addAd" element={<AddAdvertisement />} />
          <Route path="/updateadd" element={<ManageAdvertisements />} />
          <Route path="/completedorders" element={<CompletedOrders />} />
          <Route path="/editcategory/:id" element={<EditCategory />} />
        <Route path="/admin/login" element={<AdminLogin />} />
  

          <Route path="/viewcategory" element={<ViewCategory />} />

          <Route path="*" element={<UserNotFound />} />
        </Routes>

      </div>

      {/* Footer show only for normal users */}
      {role !== "admin" && <Footer />}

    </Router>
  );
}

export default App;
