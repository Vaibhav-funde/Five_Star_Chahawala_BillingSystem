import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";
import autoTable from "jspdf-autotable";
import "./App.css";

function Addcart() {
  const [cartItems, setCartItems] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [paymentMode, setPaymentMode] = useState(""); // cash | online
  const navigate = useNavigate();


  useEffect(() => {
     const loggedIn = localStorage.getItem("isLoggedIn");

     
     const storedRole = localStorage.getItem("role");
   
     // If not logged in → redirect
     if (loggedIn !== "true") {
       navigate("/login");
       return;
     }
   
     // If user is NOT customer → redirect
     const allowedRoles = ["customer", "hotel", "admin"];
 
 if (!allowedRoles.includes(storedRole)) {
   // User role is not allowed → redirect to login
   navigate("/login");
   return;
 }
   
   }, [navigate]);





  // 🔥 SAVE BILL TO SALES TABLE (same logic like OrderCheck)
const saveBillToDB = async () => {
  if (!cartItems.length) return;

  const soldItems = cartItems.map(item => ({
    itemName: item.name,
    quantity: item.qty,
    total: item.price * item.qty,
  }));

  try {
    await fetch("http://localhost:8081/sales/add-multiple", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(soldItems),
    });

    alert("✅ Bill saved in Sales Database!");
    localStorage.removeItem("cart");
  } catch (err) {
    console.error("❌ Error saving bill:", err);
    alert("❌ Could not store bill! Check backend logs.");
  }
};

// ✅ SAVE INVOICE TO DATABASE (Hotel Only)
  const saveInvoiceForHotel = async () => {
    if (role !== "hotel" || !cartItems.length) return;

    try {
      await axios.post("http://localhost:8081/api/invoice/save", {
        username,
        grandTotal: subtotal,
        items: cartItems.map((item) => ({
          itemName: item.name,
          price: item.price,
          qty: item.qty,
          total: item.price * item.qty,
        })),
      });
      alert("✅ Invoice saved to database!");
    } catch (err) {
      console.error("❌ Error saving invoice:", err);
      alert("❌ Could not save invoice!");
    }
  };

// 📄 GENERATE INVOICE PDF (DOWNLOAD)
 const generateInvoicePDF = () => {
    const doc = new jsPDF();
    const billNo = Math.floor(Math.random() * 100000);

    doc.setFontSize(18);
    doc.text("5 Star Chahawala", 14, 15);

    doc.setFontSize(11);
    doc.text("Walunj, Tal-Pathardi Dist-Ahilyanagar 414102", 14, 22);
    doc.text("Phone: 7219349467", 14, 28);

    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 36);
    doc.text(`Customer: ${username}`, 14, 42);
    if (email) doc.text(`Email: ${email}`, 14, 48);
    doc.text(`Bill No: ${billNo}`, 150, 36);

    autoTable(doc, {
      startY: 55,
      head: [["Sr.No", "Item", "Price", "Qty", "Total"]],
      body: cartItems.map((item, i) => {
        const price = Number(item.price || 0);
        const qty = Number(item.qty || 0);
        const total = price * qty;

        return [
          i + 1,
          item.name ?? "",
          price.toFixed(2),
          qty.toString(),
          total.toFixed(2),
        ];
      }),
      foot: [
        [
          { content: "Grand Total:", colSpan: 4, styles: { halign: "right" } },
          subtotal.toFixed(2),
        ],
      ],
    });

    doc.text(
      "Thank you for visiting!",
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save(`Invoice_${billNo}.pdf`);
  };


  // ✅ Load cart and user info
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);

    const user = localStorage.getItem("username") || "Guest";
    const userRole = localStorage.getItem("role") || "customer";
    const storedEmail = localStorage.getItem("email");

    setUsername(user);
    setRole(userRole);
    setEmail(storedEmail && storedEmail !== "null" ? storedEmail : "");
  }, []);

  // ✅ Calculate total
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  // ✅ Remove item from cart
  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // 📌 PLACE ORDER + SEND INVOICE
// 🔑 Load Razorpay SDK
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 🔗 PLACE ORDER FUNCTION (used by both cash & online)
  const handlePlaceOrder = async (finalPaymentMode) => {
    if (!cartItems.length) {
      alert("⚠️ Your cart is empty!");
      return;
    }
    if (!email) {
      alert("❌ Email not found! Please login again.");
      return;
    }

    const orderData = {
      username,
      email,
      items: cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      totalAmount: subtotal,
      orderDate: new Date().toISOString().slice(0, 19),
      status: "pending",
     paymentMode: finalPaymentMode, // save actual value
    };

    try {
      const res = await fetch("http://localhost:8081/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) {
        alert("❌ Failed to save order!");
        return;
      }

      generateInvoicePDF();

      await fetch("http://localhost:8081/orders/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      alert("✅ Order placed & Invoice sent!");
      localStorage.removeItem("cart");
      setCartItems([]);
      navigate("/success");
    } catch (err) {
      console.error(err);
      alert("❌ Server Error!");
    }
  };

  // 💳 ONLINE PAYMENT HANDLER
 const handleOnlinePayment = async () => {
  if (!email) {
    alert("❌ Please login again");
    return;
  }

  setPaymentMode("online");

  const loaded = await loadRazorpay();
  if (!loaded) {
    alert("❌ Razorpay SDK failed");
    return;
  }

  const orderRes = await fetch("http://localhost:8081/payment/create-order", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ amount: subtotal }),
});

const orderText = await orderRes.text();
const orderData = JSON.parse(orderText);




  // 2️⃣ Razorpay Checkout
  const options = {
    key: "rzp_test_S3pDiRKDcsb5sA",
    amount: orderData.amount,
    currency: "INR",
    name: "5 Star Chahawala",
    description: "Food Order Payment",
    order_id: orderData.id,

    handler: async function (response) {
      // ✅ Payment success (verified by Razorpay)
      alert("✅ Payment Successful");

      await handlePlaceOrder("online"); // save order AFTER payment
    },

    prefill: {
      name: username,
      email: email,
    },

    theme: { color: "#7B3F00" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

  // 💵 CASH PAYMENT HANDLER
  const handleCashSelect = () => {
    setPaymentMode("cash");
     handlePlaceOrder();  
    alert("💵 Cash Selected. Click Place Order to confirm.");
  };
  if (cartItems.length === 0) {
    return (
      <div className="bill-container empty">
        <h2>🛒 Your Cart</h2>
        <p>No items in your cart.</p>
      </div>
    );
  }

  return (
   <div className="page-content">
    <div className="bill-container" id="print-bill">
      <div className="bill-header">
        <h1>5 Star Chahawala</h1>
        <h4>Walunj, Tal-Pathardi Dist-Ahilyanagar 414102</h4>
        <h4>Phone: 7219349467</h4>

        <div className="bill-info">
          <p>Date: {new Date().toLocaleDateString()}</p>
          <p>
            Customer: <strong>{username}</strong>
            {email && <> ({email})</>}
          </p>
          <p>Bill No: {Math.floor(Math.random() * 1000)}</p>
        </div>
      </div>

      <table className="bill-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>₹{item.price}</td>
              <td>₹{(item.price * item.qty).toFixed(2)}</td>
              <td>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="price-summary">
        <h2>
          <strong>Total Amount:</strong> ₹{subtotal.toFixed(2)}
        </h2>
      </div>

      <div className="thanks-visiting">
        <p>🙏 Thank you for visiting! ☕</p>
      </div>

      <footer className="bill-footer">
        
 
      {/* CUSTOMER PAYMENT OPTIONS */}
      {role === "customer" && (
        <>
          <button onClick={handleOnlinePayment} className="checkout-btn">💳 Online Payment & Place Order</button>
         
          {paymentMode === "cash" && (
            <button onClick={handleCashSelect} className="checkout-btn">💵 Cash Payment & 🛒 Place Order</button>
          )}
          {paymentMode !== "cash" && (
            <button onClick={handleCashSelect} className="checkout-btn">💵 Cash Payment& 🛒 Place Order</button>
          )}  
        </>
      )}
        {role === "hotel" && (
          <button
  onClick={() => {
    window.print();
    saveBillToDB();
     saveInvoiceForHotel();
  }}
  className="print-btn"
>
  🖨 Print & Save Bill
</button>
        )}
        
      </footer>
    </div>
     </div>
  );
}

export default Addcart;