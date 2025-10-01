import React from "react";
import { Link } from "react-router-dom";

function Tables() {
  const tables = ["Table1", "Table2", "Table3", "Table4"];

  return (
    <div className="table-container">
      <h2>Select a Table</h2>
      <div className="table-grid">
        {tables.map((table) => (
          <Link key={table} to={`/table/${table}`} className="table-btn">
            {table}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Tables;
