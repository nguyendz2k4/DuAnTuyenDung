import { memo } from "react";
import EmployerHeader from "../pages/employer/EmployerHeader";
import "./layouts.scss";

const EmployerLayout = ({ children }) => (
  <div className="employer-layout">
    <EmployerHeader />
    <main className="employer-main">{children}</main>
  </div>
);

export default memo(EmployerLayout);
