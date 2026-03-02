import { spreadFullName } from "../common";

// SearchResultsModal.js
export default function SearchResultsModal({
  isOpen,
  results,
  onClose,
  onSelect,
  isLoading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Search Results</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-600">Loading results...</p>
            </div>
          ) : results && results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="px-4 py-3 text-left font-semibold text-gray-800">
                      Select
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-800">
                      Epic No
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-800">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-800">
                      Mobile
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-800">
                      Address
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((voter, index) => {
                    const fullName = `${voter.F_Name || ""} ${
                      voter.M_name || ""
                    } ${voter.L_Name || ""}`.trim();
                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-blue-50 transition"
                      >
                        <td className="px-4 py-3">
                          <button
                            onClick={() => onSelect(voter)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                          >
                            Select
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {voter.Epic || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {fullName || voter.Name || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {voter.Mobile1 || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {voter.House_No || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center items-center h-32">
              <p className="text-gray-600">No results found</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
