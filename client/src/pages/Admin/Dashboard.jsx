import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import axios from "axios";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("drivers");
  const [drivers, setDrivers] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);
  const [formData, setFormData] = useState({ name: "", contactInfo: "", assignedTours: "", status: "Active" });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const driversRes = await axios.get("http://localhost:5001/api/drivers");
      const guidesRes = await axios.get("http://localhost:5001/api/tourguides");
      setDrivers(driversRes.data);
      setTourGuides(guidesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const apiUrl = activeTab === "drivers" ? "http://localhost:5001/api/drivers" : "http://localhost:5001/api/tourguides";

    try {
      await axios.post(apiUrl, formData);
      fetchData();
      setFormData({ name: "", contactInfo: "", assignedTours: "", status: "Active" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, contactInfo: item.contactInfo, assignedTours: item.assignedTours, status: item.status });
    setEditId(item._id);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const apiUrl = activeTab === "drivers" ? "http://localhost:5001/api/drivers" : "http://localhost:5001/api/tourguides";

    try {
      await axios.put(`${apiUrl}/${editId}`, formData);
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = async (id) => {
    const apiUrl = activeTab === "drivers" ? "http://localhost:5001/api/drivers" : "http://localhost:5001/api/tourguides";

    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div className="flex h-screen  bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-6 mb-6">
            <span onClick={() => setActiveTab("drivers")} className={`cursor-pointer pb-2 border-b-2 ${activeTab === "drivers" ? "border-black font-bold" : "text-gray-500"}`}>
              Drivers
            </span>
            <span onClick={() => setActiveTab("tourGuides")} className={`cursor-pointer pb-2 border-b-2 ${activeTab === "tourGuides" ? "border-black font-bold" : "text-gray-500"}`}>
              Tour Guides
            </span>
          </div>

          {/* Add Button */}
          <button onClick={() => setShowForm(true)} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md">
            ➕ Add New
          </button>

          {/* Data Table */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-5 font-semibold pb-2 border-b border-gray-300">
              <span>Name</span>
              <span>Contact Info</span>
              <span>Assigned Tours</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {(activeTab === "drivers" ? drivers : tourGuides).map((item) => (
              <div key={item._id} className="grid grid-cols-5 py-2 border-b border-gray-100">
                <span>{item.name} <br /><small className="text-gray-500">ID: {item._id}</small></span>
                <span>{item.contactInfo}</span>
                <span>{item.assignedTours}</span>
                <span className="px-2 py-1 bg-gray-200 rounded-lg">{item.status}</span>
                <span className="space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600">✏️</button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-600">🗑️</button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-Screen Add/Edit Form Popup */}
      {(showForm || showEditModal) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{showForm ? `Add ${activeTab === "drivers" ? "Driver" : "Tour Guide"}` : `Edit ${activeTab === "drivers" ? "Driver" : "Tour Guide"}`}</h2>
            <form onSubmit={showForm ? handleAdd : handleUpdate} className="flex flex-col gap-3">
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border p-2 rounded-lg" required />
              <input type="text" placeholder="Contact Info" value={formData.contactInfo} onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })} className="border p-2 rounded-lg" required />
              <input type="text" placeholder="Assigned Tours" value={formData.assignedTours} onChange={(e) => setFormData({ ...formData, assignedTours: e.target.value })} className="border p-2 rounded-lg" required />
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="border p-2 rounded-lg">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg">{showForm ? "Add" : "Update"}</button>
              <button onClick={() => (showForm ? setShowForm(false) : setShowEditModal(false))} className="bg-gray-300 text-black py-2 rounded-lg">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
