import { api } from "@/lib/axios"

export interface CreateChatBody {
  id: string
}

export async function createChat({ id }: CreateChatBody) {
  return (await api.post("/chats", { receiverId: id })).data;
}
