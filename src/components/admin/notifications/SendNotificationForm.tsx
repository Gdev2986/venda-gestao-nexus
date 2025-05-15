import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import { toDBRole } from "@/types/user-role";

export function SendNotificationForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetRole, setTargetRole] = useState<UserRole | null>(null);
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from("profiles").select("*");
        if (error) throw error;
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Falha ao carregar lista de usuários.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title || !message) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
      });
      return;
    }

    // Filter profiles based on the selected role
    const filteredProfiles = profiles.filter((profile) => 
      !targetRole || profile.role === toDBRole(targetRole)
    );

    // Send notification to each filtered user
    for (const profile of filteredProfiles) {
      try {
        const { error } = await supabase.from("notifications").insert([
          {
            user_id: profile.id,
            title,
            message,
            type: "GENERAL", // Default type
          },
        ]);

        if (error) throw error;
      } catch (error) {
        console.error("Error sending notification:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: `Falha ao enviar notificação para ${profile.email}.`,
        });
        return; // Stop sending if one fails
      }
    }

    toast({
      title: "Sucesso",
      description: "Notificações enviadas com sucesso!",
    });

    // Clear form
    setTitle("");
    setMessage("");
    setTargetRole(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Notificação</CardTitle>
        <CardDescription>
          Envie notificações para usuários específicos ou para todos os
          usuários.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da notificação"
            />
          </div>
          <div>
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mensagem da notificação"
            />
          </div>
          <div>
            <Label htmlFor="targetRole">Função Alvo (Opcional)</Label>
            <Select
              onValueChange={(value) =>
                setTargetRole(value === "all" ? null : (value as UserRole))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos os Usuários" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Usuários</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                <SelectItem value={UserRole.CLIENT}>Cliente</SelectItem>
                <SelectItem value={UserRole.FINANCIAL}>Financeiro</SelectItem>
                <SelectItem value={UserRole.PARTNER}>Parceiro</SelectItem>
                <SelectItem value={UserRole.LOGISTICS}>Logística</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar Notificação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
