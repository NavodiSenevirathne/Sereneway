import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5001/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({ name: res.data.name, email: res.data.email, password: "" });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5001/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditing(false);
      setUser({ ...user, name: formData.name, email: formData.email });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white p-6 shadow-md">
        <h2 className="text-lg font-bold mb-6">Profile</h2>
        <div className="flex flex-col gap-4">
          <span
            onClick={() => setActiveTab("profile")}
            className={`cursor-pointer pb-2 border-b-2 ${
              activeTab === "profile" ? "border-black font-semibold" : "text-gray-500"
            }`}
          >
            Profile Details
          </span>
          <span
            onClick={() => setActiveTab("history")}
            className={`cursor-pointer pb-2 border-b-2 ${
              activeTab === "history" ? "border-black font-semibold" : "text-gray-500"
            }`}
          >
            Booking History
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Profile Details</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-blue-600 hover:underline"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Booking History</h2>
            <p className="text-gray-500">No bookings yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
