
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/hooks/use-notifications';
import { Loader2 } from 'lucide-react';

export function SendNotificationForm() {
  const { toast } = useToast();
  const { sendNotification, isLoading } = useNotifications();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [userType, setUserType] = useState('all');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !message) {
      toast({
        title: 'Formulário incompleto',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSending(true);
    try {
      // In a real implementation, this would send to the right users based on userType
      // For now, we're just using a mock implementation
      await sendNotification(
        '9027d4fc-2715-4439-8c84-93aa536514fb', // Example user ID
        title,
        message,
        'GENERAL'
      );
      
      toast({
        title: 'Notificação enviada',
        description: 'A notificação foi enviada com sucesso.',
      });
      
      // Reset form
      setTitle('');
      setMessage('');
      setUserType('all');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: 'Erro ao enviar notificação',
        description: 'Não foi possível enviar a notificação. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Notificação</CardTitle>
        <CardDescription>Envie notificações para usuários ou grupos específicos</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Título da notificação"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea 
              id="message" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Conteúdo da notificação"
              required
              className="min-h-[120px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="user-type">Destinatários</Label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger id="user-type">
                <SelectValue placeholder="Selecione os destinatários" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os usuários</SelectItem>
                <SelectItem value="clients">Apenas clientes</SelectItem>
                <SelectItem value="partners">Apenas parceiros</SelectItem>
                <SelectItem value="admins">Apenas administradores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSending || isLoading}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Enviando...
              </>
            ) : (
              'Enviar Notificação'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
