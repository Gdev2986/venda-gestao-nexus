
import { useState } from "react";
import { Search } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FilterValues } from "@/hooks/use-partners";

// Define filter schema
const filterSchema = z.object({
  searchTerm: z.string().optional(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
  commissionRange: z.tuple([z.number(), z.number()]).optional(),
});

interface PartnerFilterProps {
  onFilter: (values: FilterValues) => void;
}

export default function PartnerFilter({ onFilter }: PartnerFilterProps) {
  const [dateOpen, setDateOpen] = useState(false);

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      searchTerm: "",
      dateRange: undefined,
      commissionRange: [0, 100],
    },
  });

  const handleSubmit = (values: z.infer<typeof filterSchema>) => {
    onFilter({
      searchTerm: values.searchTerm || "",
      commissionRange: values.commissionRange || [0, 100],
    });
  };

  const clearFilters = () => {
    form.reset({
      searchTerm: "",
      dateRange: undefined,
      commissionRange: [0, 100],
    });
    onFilter({
      searchTerm: "",
      commissionRange: [0, 100],
    });
  };

  const selectedDateRange = form.watch("dateRange");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
        <div className="flex flex-col sm:flex-row gap-3">
          <FormField
            control={form.control}
            name="searchTerm"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Buscar por nome..."
                      {...field}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="flex-shrink-0 w-full sm:w-auto">
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full sm:w-[240px] justify-start text-left font-normal"
                      >
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, "dd/MM/yyyy")} -{" "}
                              {format(field.value.to, "dd/MM/yyyy")}
                            </>
                          ) : (
                            format(field.value.from, "dd/MM/yyyy")
                          )
                        ) : (
                          <span className="text-muted-foreground">Selecionar período</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="range"
                      selected={field.value as DateRange}
                      onSelect={(range) => {
                        field.onChange(range);
                        if (range?.to) {
                          setDateOpen(false);
                        }
                      }}
                      numberOfMonths={1}
                      locale={ptBR}
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <div className="flex gap-2 w-full sm:w-auto">
            <Button type="submit" className="flex-1 sm:flex-none">Filtrar</Button>
            <Button type="button" variant="outline" onClick={clearFilters} className="flex-1 sm:flex-none">
              Limpar
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
