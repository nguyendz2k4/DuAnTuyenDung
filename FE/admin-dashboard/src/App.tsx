import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import UserManagement from "./pages/Forms/UserManagement";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import AddAccounts from "./pages/Forms/AddAccounts";
import Notify from "./components/header/AllNotificationsPage";

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected + Layout */}
        <Route
          path="/"
          element={
            <PrivateRoute allowedRoles={["Admin", "admin"]}>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="profile" element={<UserProfiles />} />
          <Route path="AddAccounts" element={<AddAccounts />} />
          <Route path="notifications" element={<Notify />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="UserManagement" element={<UserManagement />} />
        </Route>

        {/* Other */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
