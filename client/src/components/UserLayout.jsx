

import React from 'react';
import { Outlet } from 'react-router-dom';
import UserHeader from './UserHeader';

function UserLayout() {
  return (
    <>
      <UserHeader />
      <main>
        <Outlet /> {/* This is where your user page content will be rendered */}
      </main>
    </>
  );
}

export default UserLayout;