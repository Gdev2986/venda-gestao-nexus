
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Extend the profile schema to include address fields
const personalFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 dígitos.",
  }).optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

type PersonalFormValues = z.infer<typeof personalFormSchema>;

// Define the extended profile type to match our expected data
type ExtendedProfile = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "ADMIN" | "FINANCIAL" | "PARTNER" | "LOGISTICS" | "CLIENT";
  avatar?: string;
  created_at: string;
  updated_at: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

export function PersonalDataForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PersonalFormValues>({
    resolver: zodResolver(personalFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Cast data to ExtendedProfile to allow for the address fields
          const profileData = data as unknown as ExtendedProfile;
          
          form.reset({
            name: profileData.name || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            address: profileData.address || "",
            city: profileData.city || "",
            state: profileData.state || "",
            zipCode: profileData.zipCode || "",
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar seus dados pessoais."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, form, toast]);

  // Save user profile data
  const onSubmit = async (data: PersonalFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Create an update object with our fields
      const updateData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      };
        
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Dados atualizados",
        description: "Seus dados pessoais foram salvos com sucesso."
      });
    } catch (error) {
      console.error('Error updating user data:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar seus dados pessoais."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Endereço (Opcional)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número, complemento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Sua cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="UF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input placeholder="00000-000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar dados"}
        </Button>
      </form>
    </Form>
  );
}
