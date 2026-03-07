// userService.js
// Service for managing users (add, fetch, update, delete)

export async function fetchAllUsers() {
  const res = await fetch(`/api/users`);
  const result = await res.json();
  return { ok: res.ok, ...result };
}

export async function fetchRoles() {
  const res = await fetch(`/api/roles`);
  const result = await res.json();
  return { ok: res.ok, ...result };
}

export async function fetchDesignation() {
  const res = await fetch(`/api/designation`);
  const result = await res.json();
  return { ok: res.ok, ...result };
}

export async function addUser(userData) {
  const { id, name, email, password, role_id, is_lock } = userData;

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  const payload = {
    name,
    email,
    password: password || null,
    role_id: role_id || 2, // Default to user role
    is_lock: is_lock || true, // Default to locked
  };

  const res = await fetch(`/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  return { ok: res.ok, data: { id: result.id } };
}
