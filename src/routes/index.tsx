import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AppLayout from "@/components/layouts/AppLayout";
import Event from "@/pages/Event";
import Home from "@/pages/Home";

function App() {
  return (
    <Router basename={`${import.meta.env.PC_BASE ?? "/"}`}>
      <Routes>
        <Route path="/" element={<Navigate to="home" />} />
        <Route element={<AppLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="event/:event?" element={<Event />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
