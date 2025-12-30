import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./App.css";

function Addcart() {
  const [cartItems, setCartItems] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
     const loggedIn = sessionStorage.getItem("isLoggedIn");
     
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
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
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
       saveBillToDB();


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
        {role === "hotel" && (
          <button
  onClick={() => {
    window.print();
    saveBillToDB();
  }}
  className="print-btn"
>
  🖨 Print & Save Bill
</button>
        )}
        <button onClick={handlePlaceOrder} className="checkout-btn">
          🛒 Place Order & Send Invoice
        </button>
      </footer>
    </div>
     </div>
  );
}

export default Addcart;
