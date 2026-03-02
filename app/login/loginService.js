// loginService.js
// Handles login API call for the app

export async function loginUser(email, password) {
  const res = await fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const result = await res.json();
  return { ok: res.ok, ...result };
}
