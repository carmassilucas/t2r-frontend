import { api } from "@/lib/axios";

export interface Chat {
  id: string;
  name: string;
  profilePicture: string;
  email: string;
  lastMessage: string;
  unreadMessages: number;
}

export async function getChats() {
  return (await api.get<Chat[]>("/chats")).data;
}
