import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import AuthLayout from "@/components/auth/AuthLayout";

// Define a schema for form validation using Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(8, {
    message: "Senha deve ter pelo menos 8 caracteres.",
  }),
});

const Register = () => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Fixed signUp call to match the expected type signature
      const { error } = await signUp({
        email: values.email,
        password: values.password,
        name: values.name
      });

      if (error) {
        toast({
          title: "Falha no registro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registro realizado com sucesso",
          description: "Por favor, verifique seu email para ativar sua conta.",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      toast({
        title: "Falha no registro",
        description: "Houve um problema durante o registro.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Criar uma conta
          </h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <Input
                type="text"
                id="name"
                placeholder="Seu nome"
                {...form.register("name")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="seuemail@exemplo.com"
                {...form.register("email")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <Input
                type="password"
                id="password"
                placeholder="********"
                {...form.register("password")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Button
                type="submit"
                className="w-full justify-center"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm">
              Já tem uma conta?{" "}
              <a href="/login" className="text-indigo-600 hover:underline">
                Faça login
              </a>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
