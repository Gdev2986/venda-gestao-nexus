
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { PATHS } from "./routes/paths";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import ClientNew from "./pages/ClientNew";
import Machines from "./pages/Machines";
import Sales from "./pages/Sales";
import Payments from "./pages/Payments";
import Partners from "./pages/Partners";
import Register from "./pages/Register";
import Fees from "./pages/Fees";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path={PATHS.HOME} element={<Index />} />
          <Route path={PATHS.DASHBOARD} element={<Dashboard />} />
          <Route path={PATHS.CLIENTS} element={<Clients />} />
          <Route path={PATHS.CLIENT_DETAILS()} element={<ClientDetail />} />
          <Route path={PATHS.CLIENT_NEW} element={<ClientNew />} />
          <Route path={PATHS.MACHINES} element={<Machines />} />
          <Route path={PATHS.SALES} element={<Sales />} />
          <Route path={PATHS.PAYMENTS} element={<Payments />} />
          <Route path={PATHS.PARTNERS} element={<Partners />} />
          <Route path={PATHS.REGISTER} element={<Register />} />
          <Route path={PATHS.FEES} element={<Fees />} />
          <Route path={PATHS.REPORTS} element={<Reports />} />
          <Route path={PATHS.SETTINGS} element={<Settings />} />
          <Route path={PATHS.SUPPORT} element={<Support />} />
          <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
