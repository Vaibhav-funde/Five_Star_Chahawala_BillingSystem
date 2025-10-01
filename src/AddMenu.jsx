import { useState } from "react";
import axios from "axios";
import "./App.css";

function AddMenu({ user }) {
  const [item, setItem] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: ""
  });

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Protect against undefined user
    
    try {
      // 1. Get all items
      const res = await axios.get("http://localhost:5000/Item");
      const items = res.data;

      // 2. Find the highest id
      let newId = 1;
      if (items.length > 0) {
        const lastItem = items[items.length - 1]; // last element
        newId = parseInt(lastItem.id) + 1;
      }

      // 3. Add new item with id = last id + 1
      const newItem = { ...item, id: newId.toString() };

      await axios.post("http://localhost:5000/Item", newItem);

      alert("Item added successfully with ID " + newId);

      // 4. Reset form
      setItem({ name: "", price: "", description: "", image: "", category: "" });
    } catch (err) {
      alert("Error adding item: " + err.message);
    }
  };

  return (
    <div className="add-item-container">
      <h2>Add New Menu Item</h2>
      <form className="add-item-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Item Name" value={item.name} onChange={handleChange} />
        <input name="price" placeholder="Price" type="number" value={item.price} onChange={handleChange} />
        <input name="description" placeholder="Description" value={item.description} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={item.image} onChange={handleChange} />
        <input name="category" placeholder="Category" value={item.category} onChange={handleChange} />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default AddMenu;
