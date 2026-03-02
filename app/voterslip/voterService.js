// voterService.js
// Service for fetching voter data from voterdata table

export async function searchVoterByEpicNo(epicNo) {
  if (!epicNo || epicNo.trim() === "") {
    throw new Error("Epic No is required");
  }

  const res = await fetch(
    `/api/voters?epicNo=${encodeURIComponent(epicNo.trim().toUpperCase())}`
  );
  const result = await res.json();
  return { ok: res.ok, ...result };
}
export async function searchVoterByName(firstName, middleName, lastName) {
  if (
    (!firstName || firstName.trim() === "") &&
    (!middleName || middleName.trim() === "") &&
    (!lastName || lastName.trim() === "")
  ) {
    throw new Error("At least one name field is required");
  }

  const params = new URLSearchParams();
  if (firstName && firstName.trim())
    params.append("firstName", firstName.trim().toLowerCase());
  if (middleName && middleName.trim())
    params.append("middleName", middleName.trim().toLowerCase());
  if (lastName && lastName.trim())
    params.append("lastName", lastName.trim().toLowerCase());

  const res = await fetch(`/api/voters/search?${params.toString()}`);
  const result = await res.json();
  return { ok: res.ok, ...result };
}
