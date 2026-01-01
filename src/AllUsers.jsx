import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Ensure your CSS has the styles I sent earlier

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // Search state

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/users/all");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user by ID
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/users/${id}`);
      alert("User deleted successfully!");
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user!");
    }
  };

  // Filtered users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="all-users-wrapper">
      <h2>All Users</h2>

      {/* Search input */}
      <div className="search">

         <label className="search-label">
        Search   
        </label>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            width: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
             
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${user.name}?`
                        )
                      ) {
                        deleteUser(user.id);
                      }
                    }}
                    style={{ backgroundColor: "red", color: "#fff" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllUsers;
