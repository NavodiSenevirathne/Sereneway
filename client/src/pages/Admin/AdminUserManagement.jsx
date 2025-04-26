import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import axios from "axios";
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable";  // Add this line

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  console.log('users', users)
  const [formData, setFormData] = useState({ name: "", email: "", role: "user", password: "" });
  const [editId, setEditId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await axios.get("http://localhost:5001/api/users/users");
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, email: item.email, role: item.role, password: "" });
    setEditId(item._id);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Prepare the data to update, include password only if it's not empty
      const updateData = { ...formData };
      if (!formData.password) {
        delete updateData.password; // Do not send password if not updated
      }

      await axios.put(`http://localhost:5001/api/users/user/${editId}`, updateData);
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/users/user/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Set font and size
    doc.setFont("helvetica");
    doc.setFontSize(12);
  
    // Title of the document
    doc.text("Admin User Management", 20, 10);
  
    // Table headers
    const headers = ["Name", "Email", "Role"];
    
    // Prepare the data (assuming `users` is an array of user objects)
    const data = users.map((item) => [item.name, item.email, item.role]);
  
    // Starting position for the table
    let startY = 20;
    const cellHeight = 10; // Height of each row
    const cellPadding = 4; // Padding inside each cell
  
    // Column positions based on content width
    const headerXPositions = [20, 60, 120]; // X positions for each column header
    const columnWidth = [40, 60, 40]; // Width of each column
  
    // Draw the table header
    headers.forEach((header, index) => {
      doc.text(header, headerXPositions[index] + cellPadding, startY + cellPadding);
      doc.rect(headerXPositions[index], startY, columnWidth[index], cellHeight); // Draw rectangle for each cell in header
    });
  
    // Move to the next row after headers
    startY += cellHeight;
  
    // Draw the line separating the header from the rows (only once)
    doc.setLineWidth(0.5);
    doc.line(headerXPositions[0], startY, headerXPositions[0] + columnWidth.reduce((a, b) => a + b, 0), startY);
  
    // Draw table rows (data)
    data.forEach((row, rowIndex) => {
      row.forEach((value, index) => {
        // Draw each cell
        doc.text(value, headerXPositions[index] + cellPadding, startY + cellPadding);
        doc.rect(headerXPositions[index], startY, columnWidth[index], cellHeight); // Draw rectangle for each cell
      });
  
      // Move to the next row
      startY += cellHeight;
  
      // Draw horizontal line after each row, but avoid it after the last row
      if (rowIndex < data.length - 1) {
        doc.line(headerXPositions[0], startY, headerXPositions[0] + columnWidth.reduce((a, b) => a + b, 0), startY); // Line for each row
      }
    });
  
    // Save the PDF with the generated table
    doc.save("admin-users-manual-table.pdf");
  };
  
  return (
    <div className="flex  h-screen bg-gray-100 ">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-6 mb-6">
            <span
              onClick={() => setActiveTab("users")}
              className={`cursor-pointer pb-2 border-b-2 ${activeTab === "users" ? "border-black font-bold" : "text-gray-500"}`}
            >
              Admin User Management
            </span>
           
            <button
              onClick={exportToPDF}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              Export Users as PDF
            </button>
         
          </div>

          {/* Data Table */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-5 font-semibold pb-2 border-b border-gray-300">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Actions</span>
            </div>

            {users.map((item) => (
              <div key={item._id} className="grid grid-cols-5 py-2 border-b border-gray-100">
                <span>{item.name} <br /><small className="text-gray-500">ID: {item._id}</small></span>
                <span>{item.email}</span>
                <span>{item.role}</span>
                <span className="space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600">✏</button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-600">🗑</button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-Screen Edit Form Popup */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border p-2 rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border p-2 rounded-lg"
                required
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="border p-2 rounded-lg"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <input
                type="password"
                placeholder="Change Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border p-2 rounded-lg"
              />
              <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg">
                Update User
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-300 text-black py-2 rounded-lg"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;