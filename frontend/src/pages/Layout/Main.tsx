import { Outlet } from "react-router-dom";
import RightSidebar from "../../components/RightSidebar";

const AppLayout = () => {
  return (
    <div className="flex justify-center">
      <div className="flex">
        <RightSidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
