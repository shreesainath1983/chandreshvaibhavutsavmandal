// profileService.js
// Handles profile-related API calls for the app

export async function resetPassword(id, oldPassword, newPassword) {
  const res = await fetch(`/api/users/resetpassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, oldPassword, newPassword }),
  });
  const result = await res.json();
  return { ok: res.ok, ...result };
}
