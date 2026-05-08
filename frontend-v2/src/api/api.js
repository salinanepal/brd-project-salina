const API = "http://localhost:8000";
// AUTH
export const loginUser = async ({ name, email }) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.detail || "Login failed");
  return result;
};
 
export const registerUser = async ({ name, email }) => {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.detail || "Registration failed");
  return result;
};

// USERS
// export const getUsers = async () => {
//   const res = await fetch(`${API}/users`);
//   return res.json();
// };

// export const createUser = async (user) => {
//   const res = await fetch(`${API}/users`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(user),
//   });

//   const result = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     throw new Error(result.detail || "Request failed");
//   }

//   return result;
// };



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
    const errData = await res.json();
    throw new Error(errData.detail || errData.message || "Failed to create goal");
  }

  return res.json();
};


export const getGoalSummary = async (goalId) => {
  const res = await fetch(`${API}/goals/${goalId}/summary`);

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(result.detail || "Failed to load goal");
  }

  return result;
};

export const createContribution = async (contribution) => {
  const res = await fetch(`${API}/contributions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contribution),
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(result.detail || "Failed to create contribution");
  }

  return result;
};