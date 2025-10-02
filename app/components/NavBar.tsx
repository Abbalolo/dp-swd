"use client";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

import React from "react";
import Image from "next/image";


function NavBar() {
  const { user, signOut } = useAuth();
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
          
            <Image src={"/logo.png"} width={30} height={30} alt="logo" />
            <h1 className="text-xl font-bold text-green-600">
              {user ? "DPT" : "Diabetes Prediction Tool"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">
                  Welcome, {user.full_name || user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/authentication/login"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                >
                  Login
                </Link>
                <Link
                  href="/authentication/register"
                  className="border border-green-600 text-green-600 px-4 py-2 rounded-lg text-sm hover:bg-green-50 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
