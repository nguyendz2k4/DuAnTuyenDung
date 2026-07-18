import { memo } from "react";
import Header from "../pages/users/theme/header";
import Footer from "../pages/users/theme/footer";
import "./layouts.scss";

const PublicLayout = ({ children }) => (
  <div className="site-layout public-layout">
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);

export default memo(PublicLayout);
