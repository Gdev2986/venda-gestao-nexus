
import { BarChart as RechartsBarChart, Bar, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import React from "react";

export const LineChart = ({ data }: { data: any[] }) => {
  return (
    <ChartContainer 
      config={{
        sales: {
          label: "Vendas",
          color: "hsl(var(--primary))"
        },
        total: {
          label: "Total",
          color: "hsl(var(--primary))"
        }
      }}
      className="aspect-[4/3] h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis 
            tickFormatter={(value) => new Intl.NumberFormat("pt-BR", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)}
          />
          <RechartsTooltip 
            formatter={(value: any) => (
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(value)
            )}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export const BarChart = ({ data }: { data: any[] }) => {
  return (
    <ChartContainer 
      config={{
        value: {
          label: "Valor",
          color: "hsl(var(--primary))"
        }
      }}
      className="aspect-[4/3] h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis 
            tickFormatter={(value) => new Intl.NumberFormat("pt-BR", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)}
          />
          <RechartsTooltip
            formatter={(value: any) => (
              new Intl.NumberFormat("pt-BR", {
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value / 100)
            )}
          />
          <Legend />
          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
