const API = "http://localhost:8000";

// USERS
export const getUsers = async () => {
  const res = await fetch(`${API}/users`);
  return res.json();
};

export const createUser = async (data) => {
  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteUser = async (id) => {
  await fetch(`${API}/users/${id}`, { method: "DELETE" });
};

// GOALS
export const getGoals = async () => {
  const res = await fetch(`${API}/goals`);
  return res.json();
};

export const createGoal = async (data) => {
  const res = await fetch(`${API}/goals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteGoal = async (id) => {
  await fetch(`${API}/goals/${id}`, { method: "DELETE" });
};

export const getGoalSummary = async (id) => {
  const res = await fetch(`${API}/goals/${id}/summary`);
  return res.json();
};

// CONTRIBUTIONS
export const addContribution = async (data) => {
  const res = await fetch(`${API}/contributions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};