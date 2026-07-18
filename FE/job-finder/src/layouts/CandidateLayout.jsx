import { memo } from "react";
import Header from "../pages/users/theme/header";
import Footer from "../pages/users/theme/footer";
import RightSidebar from "../pages/users/theme/RightSidebar/RightSidebar";
import "./layouts.scss";

const CandidateLayout = ({ children }) => (
  <div className="site-layout candidate-layout">
    <Header />
    <RightSidebar />
    <main>{children}</main>
    <Footer />
  </div>
);

export default memo(CandidateLayout);
