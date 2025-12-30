import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Crud() {
  const navigate = useNavigate();

  return (
    <div className="crud-container">
      <h1 className="crud-title">Items Operations</h1>
      <div className="crud-buttons">
        <button className="crud-btn add" onClick={() => navigate("/additem")}>
          Add Item
        </button>

        <button className="crud-btn update" onClick={() => navigate("/updateitem/:id")}>
          Update Item
        </button>

        <button className="crud-btn view" onClick={() => navigate("/itemlist")}>
          View Item
        </button>

        <button className="crud-btn delete" onClick={() => navigate("/deleteitem")}>
          Delete Item
        </button>
      </div>
    </div>
  );
}

export default Crud;
