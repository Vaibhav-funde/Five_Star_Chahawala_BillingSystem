import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function UpdateMenuItem({ user }) {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [itemData, setItemData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: ""
  });

  // ✅ Load all menu items
  useEffect(() => {
    axios.get("http://localhost:5000/Item")
      .then(res => setItems(res.data))
      .catch(err => console.error("Error fetching items:", err));
  }, []);

  // ✅ When user selects an item, load its data into form
  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    const selectedItem = items.find(i => i.id === id);
    if (selectedItem) {
      setItemData({
        name: selectedItem.name,
        price: selectedItem.price,
        description: selectedItem.description,
        image: selectedItem.image,
        category: selectedItem.category
      });
    }
  };

  // ✅ Update form state
  const handleChange = (e) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value });
  };

  // ✅ Save updated item
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedId) {
      alert("Please select an item first.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/Item/${selectedId}`, itemData);
      alert("Item updated successfully!");

      // reload updated list
      const res = await axios.get("http://localhost:5000/Item");
      setItems(res.data);

    } catch (err) {
      alert("Error updating item: " + err.message);
    }
  };

  return (
    <div className="menu-update-container">
      <h2 className="menu-update-title">Update Menu Item</h2>

      {/* Dropdown to select item */}
      <select className="menu-update-select" value={selectedId} onChange={handleSelect}>
        <option value="">-- Select Item --</option>
        {items.map(i => (
          <option key={i.id} value={i.id}>
            {i.name} (ID: {i.id})
          </option>
        ))}
      </select>

      {/* Update form */}
      {selectedId && (
        <form className="menu-update-form" onSubmit={handleUpdate}>
          <input className="menu-update-input" name="name" placeholder="Item Name" value={itemData.name} onChange={handleChange} />
          <input className="menu-update-input" name="price" placeholder="Price" type="number" value={itemData.price} onChange={handleChange} />
          <input className="menu-update-input" name="description" placeholder="Description" value={itemData.description} onChange={handleChange} />
          <input className="menu-update-input" name="image" placeholder="Image URL" value={itemData.image} onChange={handleChange} />
          <input className="menu-update-input" name="category" placeholder="Category" value={itemData.category} onChange={handleChange} />
          <button className="menu-update-button" type="submit">Update Item</button>
        </form>
      )}
    </div>
  );
}

export default UpdateMenuItem;
