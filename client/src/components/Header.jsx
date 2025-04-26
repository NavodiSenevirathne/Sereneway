import React from "react";
import { Link ,useNavigate} from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Check if user is logged in
  const user = localStorage.getItem("user"); // Check if user is logged in
  
 

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token on logout
    localStorage.removeItem("user"); // Clear user data if stored
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Serene</span>
            <span className="text-slate-700">Way</span>
          </h1>
        </Link>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
         
          <Link to="/aboutus">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About Us
            </li>
          </Link>
          <Link to="/share">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Experiences
            </li>
          </Link>
         

          <li className="hidden sm:inline text-slate-700 hover:underline">
            Offers
          </li>
          <li className="hidden sm:inline text-slate-700 hover:underline">
            Gallery
          </li>
          {token ? (
          <>
 <Link to={user === "admin" ? "/admin/dashboard" : "/dashboard/profile"} className="mr-4">
                Dashboard
              </Link>            <button onClick={handleLogout} className="text-red-500">Logout</button>
          </>
        ) : (
          <Link to="/login" className="mr-4">
             <li className="hidden sm:inline text-slate-700 hover:underline">Login</li></Link>
        )}
        </ul>
      </div>
    </header>
  );
}
