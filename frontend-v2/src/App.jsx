import {Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import GoalsPage from "./pages/GoalsPage";
import GoalPage from "./pages/GoalPage";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/goals/:goalId" element={<GoalPage />} />
      </Routes>

  );
}