import { api } from "@/lib/axios";

export interface Message {
  id: string;
  content: string;
  read: boolean;
  replyTo?: string;
  isSender: boolean;
  createdAt: Date;
}

export async function getMessages(id: string): Promise<Message[]> {
  return (await api.get<Message[]>(`/chats/messages/${id}`)).data;
}
