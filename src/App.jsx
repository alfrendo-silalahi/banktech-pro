import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthProvider";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
