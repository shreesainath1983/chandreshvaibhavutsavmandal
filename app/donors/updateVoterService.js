// updateVoterService.js
// Service for updating voter data

export async function updateVoterData(epicNo, updateData) {
  if (!epicNo || epicNo.trim() === "") {
    throw new Error("Epic No is required");
  }
  const body = JSON.stringify({ epicNo, ...updateData });
  const res = await fetch(`/api/voters/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const result = await res.json();
  return { ok: res.ok, ...result };
}
