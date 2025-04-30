
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { LayoutDashboard, CreditCard, FileText, Monitor } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PATHS } from "@/routes/paths";
import { Spinner } from "@/components/ui/spinner";

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // If authenticated and finished loading, redirect to dashboard
    if (user && !isLoading) {
      console.log("Login: User authenticated, redirecting to dashboard");
      setRedirecting(true);
      navigate(PATHS.DASHBOARD);
    }
  }, [user, isLoading, navigate]);

  // If redirecting or loading, show a spinner
  if (isLoading || redirecting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">
          {redirecting ? "Redirecting to dashboard..." : "Loading..."}
        </p>
      </div>
    );
  }

  // If still loading or the user is not authenticated, show the login page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white p-4">
      <div className="flex flex-col md:flex-row items-center justify-center max-w-5xl w-full">
        <div className="w-full md:w-1/2 md:pr-8 text-center md:text-left mb-6 md:mb-0">
          <div className="flex items-center justify-center md:justify-start mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white text-xl font-bold mr-3">
              SP
            </div>
            <h1 className="text-3xl font-bold tracking-tight">SigmaPay</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Sales Management <span className="text-primary">Simplified</span>
          </h2>
          
          <p className="text-gray-600 text-lg mb-6">
            A complete platform to manage your POS machine sales, customers, payments and more.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="bg-primary-100 p-2 rounded-full mb-2">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Intelligent Dashboard</h3>
              <p className="text-gray-500 text-sm">View all your sales and metrics in real time.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <div className="bg-primary-100 p-2 rounded-full mb-2">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Payment Management</h3>
              <p className="text-gray-500 text-sm">Receive your payments via PIX quickly and securely.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <div className="bg-primary-100 p-2 rounded-full mb-2">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Detailed Reports</h3>
              <p className="text-gray-500 text-sm">Complete analysis of your sales performance.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <div className="bg-primary-100 p-2 rounded-full mb-2">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Cross-platform</h3>
              <p className="text-gray-500 text-sm">Access from any device, anywhere.</p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <LoginForm />
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to={PATHS.REGISTER} className="text-primary hover:underline font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
