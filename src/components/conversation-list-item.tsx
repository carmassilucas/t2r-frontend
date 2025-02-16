import { Chat } from "@/api/find-chats";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type ConversationListItemProps = {
  conversation: Chat;
  selectedConversation: Chat | undefined;
  handleConversationSelect: (conversation: Chat) => void;
};

export function ConversationListItem(props: ConversationListItemProps) {
  return (
    <div
      key={props.conversation.id}
      onClick={() => props.handleConversationSelect(props.conversation)}
      className={`relative flex items-center px-4 h-16 cursor-pointer hover:bg-primary-foreground 
        ${props.selectedConversation?.id === props.conversation.id ? "bg-muted" : ""}
      `}
    >
      <Avatar>
        <AvatarImage
          src={props.conversation.profilePicture}
          alt={props.conversation.name}
        />
        <AvatarFallback>{props.conversation.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="ml-3 flex-1">
        <p className="font-medium">{props.conversation.name}</p>
        <p className="text-sm text-gray-500 truncate max-w-md">
          {props.conversation.lastMessage}
        </p>
      </div>
  
      {props.conversation.unreadMessages > 0 && (
        <div className="ml-2 bg-muted-foreground text-white text-xs text-center font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {props.conversation.unreadMessages}
        </div>
      )}
    </div>
  )
}
