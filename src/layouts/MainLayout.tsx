
import { Outlet } from "react-router-dom";

/**
 * MainLayout is now simplified since AppLayout handles the sidebar and header.
 * This component simply renders the Outlet for nested routes.
 */
const MainLayout = () => {
  return (
    <main className="flex-1 w-full overflow-y-auto overflow-x-hidden">
      <div className="mx-auto w-full">
        <Outlet />
      </div>
    </main>
  );
};

export default MainLayout;
