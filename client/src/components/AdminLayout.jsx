import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader'; // Create this component with admin navigation

function AdminLayout() {
  return (
    <>
      <AdminHeader />
      <main>
        <Outlet /> {/* This is where your admin page content will be rendered */}
      </main>
    </>
  );
}

export default AdminLayout;