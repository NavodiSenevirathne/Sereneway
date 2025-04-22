import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
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
        </ul>
      </div>
    </header>
  );
}
