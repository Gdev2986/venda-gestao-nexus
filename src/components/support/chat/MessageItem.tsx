
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SupportMessage } from "@/types/support.types";
import { formatDate } from "@/utils/format";

interface MessageItemProps {
  message: SupportMessage;
  isMyMessage: boolean;
  currentUserId?: string;
}

export const MessageItem = ({ message, isMyMessage, currentUserId }: MessageItemProps) => {
  const getUserInitials = (message: SupportMessage) => {
    if (message.user?.name) {
      return message.user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = (message: SupportMessage) => {
    return message.user?.name || "Usuário";
  };

  return (
    <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-start gap-2 max-w-[85%] sm:max-w-[75%] ${
        isMyMessage ? "flex-row-reverse" : ""
      }`}>
        <Avatar className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0">
          <AvatarFallback className={`text-xs ${
            isMyMessage 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted"
          }`}>
            {getUserInitials(message)}
          </AvatarFallback>
        </Avatar>
        
        <div className={`rounded-lg p-2 sm:p-3 shadow-sm max-w-full ${
          isMyMessage 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        }`}>
          <div className="text-xs sm:text-sm">
            <div className="font-medium mb-1 text-xs">
              {getUserDisplayName(message)}
            </div>
            <div className="whitespace-pre-wrap break-words text-xs sm:text-sm">
              {message.message}
            </div>
            <div className={`text-xs mt-1 ${
              isMyMessage 
                ? "text-primary-foreground/70" 
                : "text-muted-foreground"
            }`}>
              {formatDate(message.created_at)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
