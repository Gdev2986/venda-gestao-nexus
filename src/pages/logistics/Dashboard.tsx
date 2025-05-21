import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DoughnutChart } from '@/components/charts/DoughnutChart';
import { TicketStatus, TicketPriority } from "@/types/enums";

const LogisticsDashboard = () => {
  const ticketData = [
    { name: 'Open', value: 40, color: '#4ade80' },
    { name: 'Pending', value: 25, color: '#facc15' },
    { name: 'In Progress', value: 15, color: '#3b82f6' },
    { name: 'Resolved', value: 20, color: '#a855f7' },
  ];

  const priorityData = [
    { name: 'High', value: 35, color: '#f43f5e' },
    { name: 'Medium', value: 45, color: '#fbbf24' },
    { name: 'Low', value: 20, color: '#34d399' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Tickets by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <DoughnutChart data={ticketData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tickets by Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <DoughnutChart data={priorityData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Active Machines</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          35
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Delivery Time</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          2.5 days
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsDashboard;
