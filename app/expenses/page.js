"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isUserLoggedIn, getStoredUser } from "../authUtils";
import Entry from "./Entry";
import Expenses from "./Expenses";

export default function ExpensePage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isUserLoggedIn()) {
      router.push("/login");
      return;
    }
    const storedUser = getStoredUser();
    setUser(storedUser);
    setIsAuthorized(true);
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="min-w-100 bg-white rounded-xl shadow-xl">
        <div className="sticky top-0 z-50 bg-white border-b border-purple-200 rounded-t-xl">
          <div className="flex">
            <div
              onClick={() => setActiveTab(1)}
              className={`px-4 py-2 cursor-pointer rounded-t-md border-b-0 transition ${
                activeTab === 1 ? "border border-purple-200 bg-purple-200" : ""
              }`}
            >
              Entry
            </div>
            <div
              onClick={() => setActiveTab(2)}
              className={`px-4 py-2 cursor-pointer rounded-t-md border-b-0 transition ${
                activeTab === 2 ? "border border-purple-200 bg-purple-200" : ""
              }`}
            >
              Expense Vouchers
            </div>
          </div>
        </div>
        <div className="border border-purple-200 rounded-b-md">
          <div className="p-8 pt-6">
            {activeTab === 1 && <Entry user={user} />}
            {activeTab === 2 && <Expenses user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
}
