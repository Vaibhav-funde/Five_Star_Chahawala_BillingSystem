import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import TotalUsers from "./TotalUsers";

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Fetch users
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

  // Reset page on search or data change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, users]);

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/users/${id}`);
      alert("User deleted successfully!");
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user!");
    }
  };

  // SEARCH FILTER
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION LOGIC */
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="all-users-wrapper">

      {/* TOP BAR */}
      <div className="users-top-bar">
        <h2 className="all-users-title">All Users</h2>
        <TotalUsers />
      </div>

      {/* SEARCH */}
      <div className="search">
        <label className="search-label">Search</label>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            backgroundColor: "#1a1a1a",
            color: "#ffffff",
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
        <>
          {/* TABLE */}
          <table>
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, i) => (
                <tr key={user.id}>
                  <td>{indexOfFirst + i + 1}</td>
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

          {/* PAGINATION */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={n === currentPage ? "page-btn active" : "page-btn"}
                onClick={() => setCurrentPage(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AllUsers;
