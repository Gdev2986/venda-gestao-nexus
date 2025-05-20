
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NotificationContentFieldsProps {
  title: string;
  message: string;
  onTitleChange: (value: string) => void;
  onMessageChange: (value: string) => void;
}

export const NotificationContentFields = ({
  title,
  message,
  onTitleChange,
  onMessageChange,
}: NotificationContentFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title">
          Título
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Título da notificação"
          required
        />
      </div>

      <div>
        <Label htmlFor="message">
          Mensagem
        </Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Conteúdo da notificação"
          className="min-h-[120px]"
          required
        />
      </div>
    </>
  );
};
