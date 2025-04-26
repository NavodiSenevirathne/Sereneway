import React from "react";
import logo from "../../src/logo.png"; // Make sure the path is correct

const Sidebar = () => {
  return (
    <div style={{ width: "250px", height: "100vh", background: "#f8f8f8", padding: "20px" }}>
      <div style={headerStyle}>
        <img src={logo} alt="Serene Logo" style={logoStyle} />
        <h2 style={titleStyle}>Serene Admin</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <a href="/admin/dashboard" style={linkStyle}>
          <i className="fas fa-tachometer-alt" style={iconStyle}></i>Dashboard
        </a>
        <a href="/admin/book" style={linkStyle}>
          <i className="fas fa-calendar-alt" style={iconStyle}></i>Bookings
        </a>
        <a href="/admin/AdminuserManage" style={linkStyle}>
          <i className="fas fa-users" style={iconStyle}></i>Users
        </a>
        <a href="/admin/CustomTour" style={linkStyle}>
          <i className="fas fa-briefcase" style={iconStyle}></i>CustomTour
        </a>
       
      </div>
    </div>
  );
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "30px"
};

const logoStyle = {
  width: "40px", // Adjust size as needed
  height: "40px", // Adjust size as needed
  marginRight: "10px"
};

const titleStyle = {
  fontSize: "20px",
  fontWeight: "bold"
};

const linkStyle = { 
  textDecoration: "none", 
  color: "#333", 
  fontSize: "16px", 
  padding: "10px", 
  display: "flex", 
  alignItems: "center" 
};

const iconStyle = {
  marginRight: "10px", 
  fontSize: "18px"
};

export default Sidebar;
