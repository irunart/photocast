import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "@/components/layouts/AppLayout";
import Event from "@/pages/Event";
import Home from "@/pages/Home";
import About from "@/pages/About";

import Person from "@/pages/Person";

import { QueryRouter as Router } from "./QueryRouter";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Navigate to="/home" />} />

        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/event/:event?" element={<Event />} />
          <Route path="/photo_request/:event?" element={<Person />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
