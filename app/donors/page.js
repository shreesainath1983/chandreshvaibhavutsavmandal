"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isUserLoggedIn, getStoredUser, isAdmin } from "../authUtils";
import SearchResultsModal from "./SearchResultsModal";
import Entry from "./Entry";
import { DonorList } from "./donorList";

export default function Donor() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);
  const [showAdminFields, setShowAdminFields] = useState(false);

  const handleSelectVoter = (voter) => {
    setModalOpen(false);
    setSearchResults([]);
  };

  useEffect(() => {
    // Check if user is logged in and token is not expired
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

  const handleTabClick = (tabIndex) => () => {
    // For now, we only have one tab. This function can be expanded when more tabs are added.
    setActiveTab(tabIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <SearchResultsModal
        isOpen={modalOpen}
        results={searchResults}
        onClose={() => {
          setModalOpen(false);
          setSearchResults([]);
        }}
        onSelect={handleSelectVoter}
        isLoading={loading}
      />
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
              <p className="text-lg font-semibold text-gray-800">
                Searching...
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="min-w-100 bg-white rounded-xl shadow-xl">
        <div className="sticky top-0 z-50 bg-white border-b-1 border-purple-200 rounded-t-xl">
          <div className="flex">
            <div
              onClick={handleTabClick(1)}
              className={`px-4 py-2 cursor-pointer rounded-t-md border-b-0 transition ${activeTab === 1 ? "border-1 border-purple-200 bg-purple-200" : ""}`}
            >
              Entry
            </div>
            <div
              onClick={handleTabClick(2)}
              className={`px-4 py-2 cursor-pointer rounded-t-md border-b-0 transition ${activeTab === 2 ? "border-1 border-purple-200 bg-purple-200" : ""}`}
            >
              Donors
            </div>
          </div>
        </div>
        {user && (
          <div className="border-1 border-purple-200 rounded-b-md">
            {activeTab === 1 && (
              <div className="p-8 pt-6">
                <Entry user={user} />
              </div>
            )}
            {activeTab === 2 && (
              <div className="p-8 pt-6">
                <DonorList user={user} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
