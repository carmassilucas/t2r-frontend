import { Chat } from "@/api/find-chats";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

type ConversationHeaderProps = {
  selectedConversation: Chat
}

export function ConversationHeader(props: ConversationHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 h-16">
      <div className="flex items-center">
        <Avatar>
          <AvatarImage src={props.selectedConversation.profilePicture} alt={props.selectedConversation.name}/>
          <AvatarFallback>{props.selectedConversation.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h3 className="text-lg font-semibold">{props.selectedConversation.name}</h3>
          <p className="text-sm text-gray-400">{props.selectedConversation.email}</p>
        </div>
      </div>
    </div>
  )
}