import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GoalsPage from "./pages/GoalsPage";
import GoalDetailsPage from "./pages/GoalDetailsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/goals" element={<GoalsPage />} />
      <Route path="/goals/:id" element={<GoalDetailsPage />} />
    </Routes>
  );
}