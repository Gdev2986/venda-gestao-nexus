
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker";

const formSchema = z.object({
  machineId: z.string().min(2, {
    message: "Machine ID must be at least 2 characters.",
  }),
  newLocation: z.string().min(2, {
    message: "New location must be at least 2 characters.",
  }),
  transferDate: z.date(),
  notes: z.string().optional(),
});

export interface MachineTransferFormProps {
  machineId?: string;
  machineName?: string;
  currentClientId?: string;
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  onCancel?: () => void;
  onTransferComplete?: () => void;
}

const MachineTransferForm: React.FC<MachineTransferFormProps> = ({ 
  machineId = "", 
  machineName = "", 
  currentClientId,
  onSubmit,
  onCancel = () => {},
  onTransferComplete = () => {}
}) => {
  const [date, setDate] = useState<Date>(new Date());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      machineId: machineId || "",
      newLocation: "",
      transferDate: date,
      notes: "",
    },
  });

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      form.setValue("transferDate", newDate);
    }
  };

  const submitHandler = (values: z.infer<typeof formSchema>) => {
    if (onSubmit) {
      onSubmit(values);
    } else {
      // If no onSubmit is provided, we'll just call onTransferComplete
      console.log("Form submitted with values:", values);
      onTransferComplete();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">
        <FormField
          control={form.control}
          name="machineId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Machine ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter machine ID" {...field} disabled={!!machineId} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter new location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="transferDate"
          render={() => (
            <FormItem>
              <FormLabel>Transfer Date</FormLabel>
              <DatePicker
                selected={date}
                onSelect={handleDateChange}
                className="w-full"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any notes about the transfer"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default MachineTransferForm;
