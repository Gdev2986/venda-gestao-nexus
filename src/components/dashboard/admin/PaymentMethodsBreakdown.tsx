
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { formatCurrency } from "@/utils/format";
import { PaymentMethod } from "@/types";

interface SaleByInstallment {
  installments: string;
  count: number;
  amount: number;
  percentage: number;
}

interface SaleByMethod {
  method: PaymentMethod;
  count: number;
  amount: number;
  percentage: number;
  installments?: SaleByInstallment[];
}

interface PaymentMethodsBreakdownProps {
  data: SaleByMethod[];
  isLoading?: boolean;
  className?: string;
}

const COLORS = {
  [PaymentMethod.CREDIT]: "#3b82f6",
  [PaymentMethod.DEBIT]: "#22c55e",
  [PaymentMethod.PIX]: "#f59e0b"
};

const getPaymentMethodLabel = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CREDIT:
      return "Crédito";
    case PaymentMethod.DEBIT:
      return "Débito";
    case PaymentMethod.PIX:
      return "Pix";
    default:
      return method;
  }
};

const PaymentMethodsBreakdown: React.FC<PaymentMethodsBreakdownProps> = ({ 
  data, 
  isLoading = false,
  className 
}) => {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  const chartData = useMemo(() => {
    return data.map(item => ({
      name: getPaymentMethodLabel(item.method),
      value: item.amount,
      count: item.count,
      percentage: item.percentage,
      color: COLORS[item.method] || "#64748b"
    }));
  }, [data]);

  // Extrai todos os dados de parcelamento do Crédito
  const creditInstallmentsData = useMemo(() => {
    const creditData = data.find(d => d.method === PaymentMethod.CREDIT);
    return creditData?.installments || [];
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border rounded-md shadow-md">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-400">
            {payload[0].payload.count} transações ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Vendas por Forma de Pagamento</CardTitle>
        <div className="flex items-center space-x-2">
          <Tabs defaultValue={viewMode} onValueChange={(v) => setViewMode(v as "chart" | "table")}>
            <TabsList className="h-8">
              <TabsTrigger value="chart" className="text-xs px-3">Gráfico</TabsTrigger>
              <TabsTrigger value="table" className="text-xs px-3">Tabela</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {viewMode === "chart" && (
            <Tabs defaultValue={chartType} onValueChange={(v) => setChartType(v as "bar" | "pie")}>
              <TabsList className="h-8">
                <TabsTrigger value="bar" className="text-xs px-3">Barras</TabsTrigger>
                <TabsTrigger value="pie" className="text-xs px-3">Pizza</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[250px] md:h-[300px] bg-muted animate-pulse rounded" />
        ) : (
          <>
            {viewMode === "chart" ? (
              <div className="h-[250px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "bar" ? (
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis
                        tickFormatter={(value) =>
                          new Intl.NumberFormat("pt-BR", {
                            notation: "compact",
                            compactDisplay: "short",
                          }).format(value)
                        }
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="value" name="Valor">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Método de Pagamento</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                      <TableHead className="text-right">Porcentagem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item) => (
                      <TableRow key={item.method}>
                        <TableCell className="font-medium">
                          {getPaymentMethodLabel(item.method)}
                        </TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.percentage.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Detalhamento por Parcelamento para Crédito */}
            {creditInstallmentsData.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Detalhamento de Crédito por Parcelamento</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parcelamento</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                        <TableHead className="text-right">% do Crédito</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creditInstallmentsData.map((item) => (
                        <TableRow key={item.installments}>
                          <TableCell>{item.installments}x</TableCell>
                          <TableCell className="text-right">{item.count}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.percentage.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsBreakdown;
