import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "@/components/layouts/AppLayout";
import Event from "@/pages/Event";
import Home from "@/pages/Home";

import { QueryRouter as Router } from "./QueryRouter";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/event/:event?" element={<Event />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
