import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff, SendHorizonal } from "lucide-react";
import { ConversationHeader } from "@/components/conversation-header";
import { ConversationListItem } from "@/components/conversation-list-item";
import { Chat as Conversation, getChats } from "@/api/find-chats";
import { sendMessage } from "@/api/send-message";
import { getMessages, Message } from "@/api/find-messages";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { WebSocketService } from "@/consumer/websocket";

export function Chat() {
  const { data: chats, isLoading: loading } = useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<Conversation>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { chatId } = useParams();

  useEffect(() => {
    if (!loading && chats && chats.length > 0) {
      if (!selectedConversation || !chats.some((chat) => chat.id === selectedConversation.id)) {
        setSelectedConversation(chatId ? chats.find((chat) => chat.id === chatId) : chats[0]);
      }
    }
  }, [loading, chats, chatId]);

  useEffect(() => {
    if (selectedConversation) {
      getMessages(selectedConversation.id)
        .then((fetchedMessages) => setMessages(fetchedMessages))
        .catch((error) => console.error("Erro ao buscar mensagens:", error));

      clearUnreadMessages(selectedConversation.id);
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    }
  }, [selectedConversation, queryClient]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto", block: "end", inline: "nearest" });
    }
  }, [messages]);

  useEffect(() => {
    const wsService = new WebSocketService();

    const notificationSound = new Audio("/notification.mp3");
    notificationSound.volume = 0.1;

    wsService.setOnMessageCallback(async (id: string) => {
      const chats = queryClient.getQueryData<Conversation[]>(["chats"]);

      if (chats?.some((chat) => chat.id === id)) {
        queryClient.invalidateQueries({ queryKey: ["chats"] });
      }

      if (selectedConversation?.id === id) {
        const updatedMessages = await getMessages(selectedConversation.id);
        setMessages(updatedMessages);
        return;
      }

      notificationSound.play();
    });

    return () => {
      wsService.disconnect();
    };
  }, [selectedConversation, queryClient]);  
  
  const clearUnreadMessages = (chatId: string) => {
    queryClient.setQueryData(["chats"], (oldChats: Conversation[]) =>
      oldChats.map((chat) =>
        chat.id === chatId ? { ...chat, unreadMessages: 0 } : chat
      )
    );
  };

  const handleConversationSelect = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    navigate("/");

    clearUnreadMessages(conversation.id);
    queryClient.invalidateQueries({ queryKey: ["chats"] });

    const updatedMessages = await getMessages(conversation.id);
    setMessages(updatedMessages);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    await sendMessage({
      content: newMessage,
      chatId: selectedConversation.id,
    });

    setNewMessage("");

    const updatedMessages = await getMessages(selectedConversation.id);
    setMessages(updatedMessages);

    queryClient.invalidateQueries({ queryKey: ["chats"] });
  };

  return (
    <>
      <Helmet title="Bate papo" />
      <div className="grid grid-cols-[1fr_3fr] antialiased">
        {chats && chats.length > 0 ? (
          <ScrollArea className="h-[calc(100vh-4.05rem)]">
            {chats.map((conversation: Conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                selectedConversation={selectedConversation}
                handleConversationSelect={handleConversationSelect}
              />
            ))}
          </ScrollArea>
        ) : (
          <div className="flex justify-center items-center flex-1">
            <p className="text-gray-500">Nenhuma conversa disponível</p>
          </div>
        )}
        <div className="flex-1 flex flex-col border-l">
          {selectedConversation ? (
            <>
              <ConversationHeader selectedConversation={selectedConversation} />
              <ScrollArea className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-12.29rem)]">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    ref={index === messages.length - 1 ? lastMessageRef : null}
                    className={`mb-4 flex ${msg.isSender ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`relative max-w-md rounded-lg px-4 py-2 ${msg.isSender ? "bg-blue-500 text-white" : "bg-gray-800 text-white"}`}>
                      <p className="mb-1.5 break-words whitespace-pre-wrap">{msg.content}</p>
                      <div className="flex items-center justify-end gap-2 text-xs text-gray-200">
                        <span>
                          {new Date(msg.createdAt).toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "numeric" })}{" "}
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {msg.read ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <div className="flex items-center w-full p-4">
                <Input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 mr-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newMessage.trim()) {
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  className={`bg-blue-500 ${!newMessage.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!newMessage.trim()}
                >
                  <SendHorizonal className="w-4 h-4 text-white" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center flex-1">
              <p className="text-gray-500">Selecione uma conversa para começar</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
