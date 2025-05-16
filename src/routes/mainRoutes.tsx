
import { Fragment } from "react";
import { AdminRoutes } from "./adminRoutes";
import { ClientRoutes } from "./clientRoutes";
import { PartnerRoutes } from "./partnerRoutes";
import { FinancialRoutes } from "./financialRoutes";
import { LogisticsRoutes } from "./logisticsRoutes";

/**
 * MainRoutes combines all application routes under a Fragment
 * This allows us to include all route groups in the main App Routes component
 */
export const MainRoutes = (
  <Fragment>
    {/* Admin Routes */}
    {AdminRoutes}
    
    {/* Client Routes */}
    {ClientRoutes}
    
    {/* Partner Routes */}
    {PartnerRoutes}
    
    {/* Financial Routes */}
    {FinancialRoutes}
    
    {/* Logistics Routes */}
    {LogisticsRoutes}
  </Fragment>
);
