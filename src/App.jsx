import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthProvider";
import { ActivityProvider } from "./context/ActivityProvider";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SeederPage from "./pages/SeederPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ActivityProvider>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/seeder" element={<SeederPage />} /> */}
            <Route path="/" element={<SignIn />} />
          </Routes>
        </ActivityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
