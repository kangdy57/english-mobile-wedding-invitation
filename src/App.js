import React from "react";
import { Routes, Route } from "react-router-dom";
import Bride from "./pages/Bride";

const App = () => (
  <Routes>
    <Route path="*" element={<Bride />} />
  </Routes>
);

export default App;
