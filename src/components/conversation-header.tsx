import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  email: string;
}

type ConversationHeaderProps = {
  selectedConversation: Conversation
}

export function ConversationHeader(props: ConversationHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 h-16">
      <div className="flex items-center">
        <Avatar>
          <AvatarImage
            src={`https://i.pravatar.cc/150?u=${props.selectedConversation.id}`}
            alt={props.selectedConversation.name}
          />
          <AvatarFallback>{props.selectedConversation.name[0]}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h3 className="text-lg font-semibold">{props.selectedConversation.name}</h3>
          <p className="text-sm text-gray-400">{props.selectedConversation.email}</p>
        </div>
      </div>
    </div>
  )
}