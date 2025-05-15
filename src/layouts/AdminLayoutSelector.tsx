
import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";

const AdminLayoutSelector = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default AdminLayoutSelector;
