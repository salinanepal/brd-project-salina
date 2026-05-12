const API = "http://localhost:8000";

//AUTH 

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.detail || "Login failed");
  return result;
};

export const registerUser = async ({ name, email, password }) => {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.detail || "Registration failed");
  return result;
};

//USERS

export const getUsers = async () => {
  const res = await fetch(`${API}/users`);
  return res.json();
};

// GOALS

export const getGoals = async () => {
  const res = await fetch(`${API}/goals`);
  return res.json();
};

export const createGoal = async (goal) => {
  const res = await fetch(`${API}/goals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goal),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to create goal");
  }
  return res.json();
};

export const getGoalSummary = async (goalId) => {
  const res = await fetch(`${API}/goals/${goalId}/summary`);
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.detail || "Failed to load goal");
  return result;
};

//CONTRIBUTIONS

export const createContribution = async (contribution) => {
  const res = await fetch(`${API}/contributions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contribution),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.detail || "Failed to create contribution");
  return result;
};