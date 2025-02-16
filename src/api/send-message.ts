import { api } from "@/lib/axios"

export interface SendMessageBody {
  content: string,
  chatId: string
}

export async function sendMessage({ content, chatId }: SendMessageBody) {
  await api.post("chats/messages/send", { content, chatId });
}
