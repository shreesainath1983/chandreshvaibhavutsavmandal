"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchVoterByEpicNo, searchVoterByName } from "./voterService";
import { spreadFullName } from "../common";
import { isUserLoggedIn, getStoredUser, isAdmin } from "../authUtils";
import SearchResultsModal from "./SearchResultsModal";
import Image from "next/image";

export default function VoterSlip() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const initFormData = {
    epicNo: "",
    name: "",
    firstName: "",
    middleName: "",
    lastName: "",
  };
  const [formData, setFormData] = useState(initFormData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null);
  const [showAdminFields, setShowAdminFields] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setError("");
    const hasNameField =
      (formData.firstName && formData.firstName.trim()) ||
      (formData.middleName && formData.middleName.trim()) ||
      (formData.lastName && formData.lastName.trim());
    // Priority 1: Search by Epic No if provided
    if (formData.epicNo && formData.epicNo.trim() !== "") {
      setLoading(true);
      try {
        const result = await searchVoterByEpicNo(formData.epicNo);
        if (result.ok && result.data) {
          const { Name, Epic, F_Name, M_Name, L_Name } = result.data;
          const { first_name, middle_name, last_name } = spreadFullName(Name);
          // Populate form with voter data
          setFormData((prev) => ({
            ...prev,
            name: Name || "",
            firstName: F_Name || first_name || "",
            middleName: M_Name || middle_name || "",
            lastName: L_Name || last_name || "",
          }));
        } else {
          setError(result.error || "Voter not found");
        }
      } catch (err) {
        setError("Failed to search voter");
      } finally {
        setLoading(false);
      }
      return;
    }
    // Priority 2: Search by Name (Admin only)
    else if (!hasNameField) {
      setError(
        "Please enter Epic No or at least one name field (First/Middle/Last Name)"
      );
      return;

      setLoading(true);
      try {
        const result = await searchVoterByName(
          formData.firstName || "",
          formData.middleName || "",
          formData.lastName || ""
        );

        if (result.ok && result.data && result.data.length > 0) {
          if (result.data.length === 1) {
            // Single result - populate form directly
            const voter = result.data[0];
            const { first_name, middle_name, last_name } = spreadFullName(
              voter.Name || `${voter.F_Name} ${voter.M_Name} ${voter.L_Name}`
            );
            setFormData((prev) => ({
              ...prev,
              epicNo: voter.Epic || "",
              name:
                voter.F_Name ||
                `${voter.F_Name} ${voter.M_Name} ${voter.L_Name}`,
              firstName: voter.F_Name || first_name || "",
              middleName: voter.M_Name || middle_name || "",
              lastName: voter.L_Name || last_name || "",
            }));
          } else {
            // Multiple results - show modal
            setSearchResults(result.data);
            setModalOpen(true);
          }
        } else {
          setError("No voters found matching the search criteria");
        }
      } catch (err) {
        setError("Failed to search voters by name");
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please enter Epic No or Name to search");
    }
  };

  const handleSelectVoter = (voter) => {
    const { first_name, middle_name, last_name } = spreadFullName(voter.Name);

    setFormData((prev) => ({
      ...prev,
      epicNo: voter.Epic || "",
      name: voter.Name || `${voter.F_Name} ${voter.M_Name} ${voter.L_Name}`,
      firstName: voter.F_Name || first_name || "",
      middleName: voter.M_Name || middle_name || "",
      lastName: voter.L_Name || last_name || "",
    }));
    setModalOpen(false);
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.epicNo || formData.epicNo.trim() === "") {
      setError("Please enter Epic No");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get userId from stored user data

      if (result.ok) {
        setError("");
        console.log("Updated Data:", result.data);
        setFormData(initFormData);
      } else {
        setError(result.error || "Failed to search voter data");
      }
    } catch (err) {
      setError("Failed to search voter data");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      <form className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl">
        <div className="sticky top-0 z-50 bg-white rounded-t-xl border-b border-gray-200 p-2 shadow-md">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-gray-800 pl-2">
                Search Voter
              </h2>
              <input
                className="w-full px-1 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-gray-700 placeholder-gray-500"
                placeholder="Enter Epic No"
                name="epicNo"
                value={formData.epicNo}
                onChange={handleChange}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={loading}
                  className="cursor-pointer p-2 bg-gray-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 flex"
                  title="Search voter by Epic No or Name"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 text-xs text-gray-600 bg-green-50 p-2 rounded">
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Middle Name"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 pt-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <div id="print-area" className="print-area">
            <div className="print-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="print-slip">
                  {/* Header */}
                  <div className="print-header">
                    <Image
                      src="/images/banner.png"
                      alt="BJP"
                      width={600}
                      height={120}
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Table */}
                  <table className="print-table">
                    <tbody>
                      <tr>
                        <th>Epic No</th>
                        <td>{formData.epicNo || "N/A"}</td>
                      </tr>
                      <tr>
                        <th>Name</th>
                        <td>{formData.name || "N/A"}</td>
                      </tr>
                      <tr>
                        <th>Father</th>
                        <td>{formData.firstName || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="print:hidden w-full mt-6 bg-green-700 text-white py-3 rounded-lg"
          >
            Print (6 per page)
          </button>

          {/* <button
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 rounded-lg hover:from-green-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
            type="submit"
          >
            Print
          </button> */}
        </div>
      </form>
    </div>
  );
}
