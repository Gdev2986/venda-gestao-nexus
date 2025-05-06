
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Reports = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to financial reports after a short delay
    const timer = setTimeout(() => {
      navigate("/financial/reports");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Redirecting to Financial Reports page...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
