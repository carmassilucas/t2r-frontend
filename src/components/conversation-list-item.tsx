import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  email: string;
}

type ConversationListItemProps = {
  conversation: Conversation
  selectedConversation: Conversation
  handleconversationversationSelect: Function
}

export function ConversationListItem(props: ConversationListItemProps) {
  return (
    <div
      key={props.conversation.id}
      onClick={() => props.handleconversationversationSelect(props.conversation)}
      className={`flex items-center px-4 h-16 cursor-pointer hover:bg-primary-foreground ${
        props.selectedConversation.id === props.conversation.id ? "bg-muted" : "" 
      }`}
    >
      <Avatar>
        <AvatarImage
          src={`https://i.pravatar.cc/150?u=${props.conversation.id}`}
          alt={props.conversation.name}
        />
        <AvatarFallback>{props.conversation.name[0]}</AvatarFallback>
      </Avatar>
      <div className="ml-3">
        <p className="font-medium">{props.conversation.name}</p>
        <p className="text-sm text-gray-500">
          {props.conversation.lastMessage}
        </p>
      </div>
    </div>
  )
}