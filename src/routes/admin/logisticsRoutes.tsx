
import { Route } from "react-router-dom";
import { PATHS } from "../paths";

// Logistics pages
import AdminLogistics from "../../pages/admin/Logistics";
import Machines from "../../pages/Machines"; // Updated import to match actual export
import MachineDetails from "../../pages/machines/MachineDetails";
import NewMachine from "../../pages/machines/NewMachine";

export const logisticsRoutes = [
  <Route 
    key="admin-logistics" 
    path="/admin/logistics" 
    element={<AdminLogistics />} 
  />,
  <Route 
    key="admin-machines" 
    path={PATHS.ADMIN.MACHINES} 
    element={<Machines />} 
  />,
  <Route 
    key="admin-machine-details" 
    path={PATHS.ADMIN.MACHINE_DETAILS()} 
    element={<MachineDetails />} 
  />,
  <Route 
    key="admin-machine-new" 
    path={PATHS.ADMIN.MACHINE_NEW} 
    element={<NewMachine />} 
  />
];
