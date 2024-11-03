import { Outlet } from "react-router-dom";
import RightSidebar from "../../components/RightSidebar";

const AppLayout = () => {
  return (
    <div className="flex justify-center">
      <div className="flex relative">
        <RightSidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
