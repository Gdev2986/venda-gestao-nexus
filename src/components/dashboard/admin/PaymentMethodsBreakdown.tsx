
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
import { Button } from "@/components/ui/button";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Table as TableIcon
} from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-md shadow-md">
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
          <div className="bg-muted/30 rounded-lg p-0.5 flex items-center">
            <Button 
              variant={viewMode === "chart" ? "secondary" : "ghost"} 
              size="sm" 
              className="h-8 px-3 rounded-l-md rounded-r-none"
              onClick={() => setViewMode("chart")}
            >
              <BarChartIcon className="h-4 w-4 mr-1" />
              Gráfico
            </Button>
            <Button 
              variant={viewMode === "table" ? "secondary" : "ghost"} 
              size="sm" 
              className="h-8 px-3 rounded-r-md rounded-l-none"
              onClick={() => setViewMode("table")}
            >
              <TableIcon className="h-4 w-4 mr-1" />
              Tabela
            </Button>
          </div>
          
          {viewMode === "chart" && (
            <div className="bg-muted/30 rounded-lg p-0.5 flex items-center">
              <Button 
                variant={chartType === "bar" ? "secondary" : "ghost"} 
                size="sm" 
                className="h-8 px-3 rounded-l-md rounded-r-none"
                onClick={() => setChartType("bar")}
              >
                <BarChartIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant={chartType === "pie" ? "secondary" : "ghost"} 
                size="sm" 
                className="h-8 px-3 rounded-r-md rounded-l-none"
                onClick={() => setChartType("pie")}
              >
                <PieChartIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[250px] md:h-[300px] bg-muted animate-pulse rounded" />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${chartType}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === "chart" ? (
                <div className="h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "bar" ? (
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <defs>
                          {chartData.map((entry, index) => (
                            <linearGradient
                              key={`gradient-${index}`}
                              id={`barGradient-${index}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                              <stop offset="95%" stopColor={entry.color} stopOpacity={0.3} />
                            </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                          tickLine={false}
                        />
                        <YAxis
                          tickFormatter={(value) =>
                            new Intl.NumberFormat("pt-BR", {
                              notation: "compact",
                              compactDisplay: "short",
                            }).format(value)
                          }
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0.1 }} />
                        <Bar 
                          dataKey="value" 
                          name="Valor"
                          radius={[4, 4, 0, 0]}
                          barSize={40}
                          animationDuration={1200}
                          animationEasing="ease-in-out"
                        >
                          {chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`url(#barGradient-${index})`}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <PieChart>
                        <defs>
                          {chartData.map((entry, index) => (
                            <linearGradient
                              key={`gradient-${index}`}
                              id={`pieGradient-${index}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                              <stop offset="95%" stopColor={entry.color} stopOpacity={0.8} />
                            </linearGradient>
                          ))}
                        </defs>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={90}
                          innerRadius={40}
                          paddingAngle={3}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          animationDuration={1200}
                          animationBegin={200}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`url(#pieGradient-${index})`} 
                              stroke="hsl(var(--background))"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip cursor={{ opacity: 0.1 }} />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Método de Pagamento</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                        <TableHead className="text-right">Porcentagem</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((item, index) => (
                        <TableRow 
                          key={item.method}
                          className={index % 2 === 0 ? "" : "bg-muted/30"}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 mr-2 rounded-full" 
                                style={{ backgroundColor: COLORS[item.method] }}
                              />
                              {getPaymentMethodLabel(item.method)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{item.count}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {item.percentage.toFixed(1)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Detalhamento por Parcelamento para Crédito */}
          {creditInstallmentsData.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-2 text-sm">Detalhamento de Crédito por Parcelamento</h4>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Parcelamento</TableHead>
                      <TableHead className="text-right w-1/4">Quantidade</TableHead>
                      <TableHead className="text-right w-1/4">Valor Total</TableHead>
                      <TableHead className="text-right w-1/4">% do Crédito</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditInstallmentsData.map((item, index) => (
                      <TableRow 
                        key={item.installments}
                        className={index % 2 === 0 ? "" : "bg-muted/30"}
                      >
                        <TableCell className="font-medium">{item.installments}x</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {item.percentage.toFixed(1)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsBreakdown;
