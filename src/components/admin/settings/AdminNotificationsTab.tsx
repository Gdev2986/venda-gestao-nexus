
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SendNotificationForm } from "@/components/admin/notifications/SendNotificationForm";

const AdminNotificationsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <SendNotificationForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotificationsTab;
