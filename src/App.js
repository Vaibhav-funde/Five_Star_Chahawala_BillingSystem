import react from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Header from './Header';
import Menu from './Menu';
import About from './About';
import Contact from './Contact';
import Login from './Login';
import Footer from './Footer';
import Signup from './Signup';
import Chaidetail from './Chaidetail';
import UserNotFound from './UserNotFound';
import MenuList from './MenuList';
import Addcart from './Addcart'
import Rating from './Rating';
import OrderCheck from './OrderCheck';
import UserOrderHistory from './UserOrderHistory';
import Bill from './Bill';
import AddMenu from './AddMenu';
import UpdateMenuItem from './UpdateMenuItem';
import MenuTable from './MenuTable';






function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home/> } />
                <Route path="/menu" element={<MenuList />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/chaid" element={<Chaidetail />} />
                <Route path="/Rating" element={<Rating/>} />
                <Route path="/cart" element={<Addcart/>} />
                <Route path="/hotel-dashboard" element={<OrderCheck />} />  {/* ✅ new */}
                <Route path="*" element = {<UserNotFound/>}/>
                <Route path="/myorders" element={<UserOrderHistory />} />
                <Route path="/bill" element={<Bill />} />
                <Route path="/addmenu" element={<AddMenu />} />
                <Route path="/update" element={<UpdateMenuItem />} />
                <Route path="/table" element={<MenuTable />} />

                


            </Routes>

            <Footer/>
        </Router>
    );
}
export default App;
