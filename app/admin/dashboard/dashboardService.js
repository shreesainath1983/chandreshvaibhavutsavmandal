// userService.js
// Service for managing users (add, fetch, update, delete)

export async function fetchAllVoters() {
  const res = await fetch(`/api/voters`);
  const result = await res.json();
  return { ok: res.ok, ...result };
}

/**
 * Fetch user-wise voterdata modification report
 * @param {Object} params
 * @param {string} params.fromDate - YYYY-MM-DD
 * @param {string} params.toDate - YYYY-MM-DD
 */
export async function fetchUserVoterdataReport({ fromDate, toDate }) {
  if (!fromDate || !toDate) {
    throw new Error("From date and To date are required");
  }

  const query = new URLSearchParams({
    fromDate,
    toDate,
  }).toString();

  const res = await fetch(`/api/dashboard?${query}`);

  const result = await res.json();
  return { ok: res.ok, ...result };
}
