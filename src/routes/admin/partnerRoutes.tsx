
import { Route } from "react-router-dom";
import { PATHS } from "../paths";

// Partner pages
import AdminPartners from "../../pages/admin/Partners";
import PartnerDetails from "../../pages/partners/PartnerDetails";
import NewPartner from "../../pages/partners/NewPartner";

// Partner Routes for Admin Module
export const partnerRoutes = [
  <Route 
    key="admin-partners" 
    path={PATHS.ADMIN.PARTNERS} 
    element={<AdminPartners />} 
  />,
  <Route 
    key="admin-partner-details" 
    path={PATHS.ADMIN.PARTNER_DETAILS()} 
    element={<PartnerDetails />} 
  />,
  <Route 
    key="admin-partner-new" 
    path={PATHS.ADMIN.PARTNER_NEW} 
    element={<NewPartner />} 
  />
];
