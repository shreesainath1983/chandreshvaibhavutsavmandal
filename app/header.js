"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getUserName,
  isAdmin,
  isContributor,
  isUserLoggedIn,
} from "./authUtils";
import "./globals.css";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Header = () => {
  const defaultDesignation = {
    name: "User",
    designation: "N/A",
  };
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isContributorUser, setIsContributorUser] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const adminStatus = isAdmin();
  const contriStatus = isContributor();
  const [userName, setUserName] = useState(defaultDesignation);
  const [isHideMenu, setIsHideMenu] = useState(true);
  const pathname = usePathname();
  useEffect(() => {
    setIsAdminUser(adminStatus);
    setIsContributorUser(contriStatus);
  }, [adminStatus, contriStatus]);

  useEffect(() => {
    setIsHideMenu(pathname === "/login");
    if (pathname !== "/login") {
      const loggedIn = isUserLoggedIn();
      if (loggedIn) setUserName(getUserName() || defaultDesignation);
    }
  }, [pathname]);

  return (
    <header className="bg-gradient-to-br from-red-200 to-purple-200 text-gray-800 p-3">
      <div
        className={`flex items-center ${isHideMenu ? "justify-center" : "justify-between"}`}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Chandresh Vaibhav Utsav Mandal Logo"
            width={60}
            height={50}
          />
          <h2 className="text-xl font-bold">Chandresh Vaibhav Utsav Mandal</h2>
        </div>
        {!isHideMenu && (
          <div>
            {/* Hamburger Icon */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col gap-1 md:hidden"
              aria-label="Toggle menu"
            >
              <span className="w-6 h-0.5 bg-purple-800"></span>
              <span className="w-6 h-0.5 bg-purple-800"></span>
              <span className="w-6 h-0.5 bg-purple-800"></span>
            </button>

            {/* Desktop Menu */}
            <nav className="hidden md:flex gap-6">
              <Link href="/donors" className="hover:text-purple-800 transition">
                Donors
              </Link>
              {isAdminUser || isContributorUser ? (
                <>
                  <Link
                    href="/admin/dashboard"
                    className="hover:text-purple-800 transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/users"
                    className="hover:text-purple-800 transition"
                  >
                    Users
                  </Link>
                </>
              ) : null}
              <Link
                href="/profile"
                className="hover:text-purple-800 transition"
              >
                Profile
              </Link>
              <div
                className="hover:text-purple-800 transition cursor-pointer"
                title="Logout"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-logout"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                  <path d="M9 12h12l-3 -3" />
                  <path d="M18 15l3 -3" />
                </svg>
              </div>
            </nav>
          </div>
        )}
      </div>
      {!isHideMenu && (
        <div className="flex justify-start mt-1 pt-1 text-sm border-t border-purple-800">
          Welcome, {userName.name} ({userName.designation})
        </div>
      )}
      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="bg-purple-300 mt-3 flex flex-col gap-4 p-4 md:hidden">
          <Link
            href="/donors"
            className="hover:text-purple-800 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Donors
          </Link>
          {isAdminUser || isContributorUser ? (
            <>
              <Link
                href="/admin/dashboard"
                className="hover:text-purple-800 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="hover:text-purple-800 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Users
              </Link>
            </>
          ) : null}
          <Link
            href="/profile"
            className="hover:text-purple-800 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </Link>
          <div
            className="hover:text-purple-800 transition cursor-pointer flex items-center gap-2"
            title="Logout"
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("user");
                window.location.href = "/login";
              }
            }}
          >
            <span>Logout</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-logout"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M9 12h12l-3 -3" />
              <path d="M18 15l3 -3" />
            </svg>
          </div>
        </nav>
      )}
    </header>
  );
};
export default Header;
