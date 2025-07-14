import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthProvider";
import { ActivityProvider } from "./context/ActivityProvider";
import NetworkStatus from "./components/NetworkStatus";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ActivityLogPages from "./pages/ActivityLogPages";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ActivityProvider>
          <NetworkStatus />
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/activitylog" element={<ActivityLogPages />} />
          </Routes>
        </ActivityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
