import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import UserManagement from "./pages/Forms/UserManagement";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import AddAccounts from "./pages/Forms/AddAccounts";
import RegistrationTopcv from "./pages/topcvPro/TopCVProRegister";
import Apply from "./pages/Forms/application";
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
            <PrivateRoute allowedRoles={["admin", "employer"]}>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="topcvpro-registration" element={<RegistrationTopcv />} />
          <Route path="profile" element={<UserProfiles />} />
          <Route path="AddAccounts" element={<AddAccounts />} />
          <Route path="application" element={<Apply />} />
          <Route path="notifications" element={<Notify />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="blank" element={<Blank />} />
          <Route path="form-elements" element={<FormElements />} />
          <Route path="UserManagement" element={<UserManagement />} />
          <Route path="basic-tables" element={<BasicTables />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="avatars" element={<Avatars />} />
          <Route path="badge" element={<Badges />} />
          <Route path="buttons" element={<Buttons />} />
          <Route path="images" element={<Images />} />
          <Route path="videos" element={<Videos />} />
          <Route path="line-chart" element={<LineChart />} />
          <Route path="bar-chart" element={<BarChart />} />
        </Route>

        {/* Other */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
