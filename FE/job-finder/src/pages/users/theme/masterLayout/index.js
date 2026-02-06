import { memo } from "react";
import Header from "../header";
import Footer from "../footer";
import HomePage from "../../homePage";
import RightSidebar from "../RightSidebar/RightSidebar";

const MasterLayout = ({ children, ...props }) => {
    return (
        <div {...props}>
            <Header />
            <RightSidebar />
            {children}
            <Footer />
        </div>
    );
};

export default memo(MasterLayout);
