"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkStyle = (path) =>
    pathname === path
      ? "text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
      : "text-gray-700 hover:text-blue-600 transition";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold tracking-tight text-gray-800">
          My App
        </h1>

        <ul className="hidden md:flex gap-6 text-sm font-medium">
          <li>
            <Link href="/" className={linkStyle("/")}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/admin" className={linkStyle("/admin")}>
              Admin
            </Link>
          </li>
          <li>
            <Link href="/ward" className={linkStyle("/ward")}>
              Ward
            </Link>
          </li>
        </ul>

        <button
          className="md:hidden flex flex-col gap-[5px]"
          onClick={() => setOpen(!open)}
        >
          <span
            className={`h-[2px] w-6 bg-gray-800 transition ${
              open ? "rotate-45 translate-y-[6px]" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-gray-800 transition ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-gray-800 transition ${
              open ? "-rotate-45 -translate-y-[6px]" : ""
            }`}
          />
        </button>
      </nav>

      {open && (
        <ul className="md:hidden flex flex-col gap-4 bg-white py-4 px-6 shadow-inner text-sm font-medium">
          <li>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={linkStyle("/")}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className={linkStyle("/admin")}
            >
              Admin
            </Link>
          </li>
          <li>
            <Link
              href="/ward"
              onClick={() => setOpen(false)}
              className={linkStyle("/ward")}
            >
              Ward
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
