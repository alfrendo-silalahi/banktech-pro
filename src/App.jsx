import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import Navbar from "./components/NavigationBar";
import Login from "./pages/Login";

function App() {
  return (
    <div className="container mx-auto">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signin" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
