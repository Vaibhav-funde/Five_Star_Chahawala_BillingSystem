import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function TotalUsers() {
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchTotalUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/users/count");
      setTotalUsers(res.data);
    } catch (err) {
      console.error("Error fetching total users:", err);
    }
  };

  useEffect(() => {
    fetchTotalUsers();
  }, []);

  return (
    <div className="total-users-card">
      <h2 className="total-users-title">Total No Of Users</h2>
      <p className="total-users-count">{totalUsers}</p>
    </div>
  );
}

export default TotalUsers;
