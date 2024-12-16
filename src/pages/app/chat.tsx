import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Helmet } from "react-helmet-async";
import { SendHorizonal } from "lucide-react";
import { ConversationHeader } from "@/components/conversation-header";
import { ConversationListItem } from "@/components/conversation-list-item";

interface Message {
  sender: string;
  content: string;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  email: string;
}

const mockConversations: Conversation[] = [
  { id: 11, name: "Alice", lastMessage: "Olá! Como você está?", email: "alice@example.com" },
  { id: 12, name: "Bob", lastMessage: "Vamos nos encontrar amanhã?", email: "bob@example.com" },
  { id: 13, name: "Charlie", lastMessage: "Enviei os documentos.", email: "charlie@example.com" },
  { id: 14, name: "David", lastMessage: "Você recebeu o arquivo?", email: "david@example.com" },
  { id: 15, name: "Eve", lastMessage: "O jantar ainda está de pé?", email: "eve@example.com" },
  { id: 16, name: "Frank", lastMessage: "Podemos revisar o projeto amanhã?", email: "frank@example.com" },
  { id: 17, name: "Grace", lastMessage: "Está disponível para uma reunião?", email: "grace@example.com" },
  { id: 18, name: "Hannah", lastMessage: "Estou enviando as alterações agora.", email: "hannah@example.com" },
  { id: 19, name: "Isaac", lastMessage: "O prazo foi estendido.", email: "isaac@example.com" },
  { id: 20, name: "Jack", lastMessage: "Vamos falar sobre o orçamento mais tarde.", email: "jack@example.com" },
  { id: 21, name: "Karen", lastMessage: "Pode me ligar assim que estiver livre?", email: "karen@example.com" },
  { id: 22, name: "Leo", lastMessage: "Tudo pronto para a apresentação?", email: "leo@example.com" },
  { id: 23, name: "Mia", lastMessage: "Você conferiu o e-mail?", email: "mia@example.com" },
  { id: 24, name: "Nina", lastMessage: "Já enviou os documentos finais?", email: "nina@example.com" },
  { id: 25, name: "Oscar", lastMessage: "A reunião foi reagendada.", email: "oscar@example.com" },
  { id: 26, name: "Pam", lastMessage: "Pode me confirmar a hora?", email: "pam@example.com" },
  { id: 27, name: "Quinn", lastMessage: "Fiquei sabendo que você vai viajar.", email: "quinn@example.com" },
  { id: 28, name: "Rachel", lastMessage: "Obrigado pelo feedback.", email: "rachel@example.com" }
];


const mockMessages: Record<number, Message[]> = {
  11: [
    { sender: "Alice", content: "Olá! Como você está?" },
    { sender: "Você", content: "Estou bem, obrigado! E você?" },
    { sender: "Alice", content: "Também estou bem. Tem algum plano para o fim de semana?" },
    { sender: "Você", content: "Sim, estou pensando em ir ao parque e talvez assistir a um filme. E você?" },
    { sender: "Alice", content: "Legal! Eu vou visitar minha família e depois podemos nos encontrar para tomar um café." },
    { sender: "Você", content: "Adoraria! Que tal no sábado à tarde?" },
    { sender: "Alice", content: "Perfeito! Conhece algum lugar agradável para nos encontrarmos?" },
    { sender: "Você", content: "Que tal no Café Central? É perto do parque e tem um ambiente bem aconchegante." },
    { sender: "Alice", content: "Ótima ideia! Nos vemos lá às 15h então." },
    { sender: "Você", content: "Combinado! Até sábado, Alice." },
    { sender: "Alice", content: "Até sábado! 😊" },
    { sender: "Alice", content: "Olá! Como você está?" },
    { sender: "Você", content: "Estou bem, obrigado! E você?" },
    { sender: "Alice", content: "Também estou bem. Tem algum plano para o fim de semana?" },
    { sender: "Você", content: "Sim, estou pensando em ir ao parque e talvez assistir a um filme. E você?" },
    { sender: "Alice", content: "Legal! Eu vou visitar minha família e depois podemos nos encontrar para tomar um café." },
    { sender: "Você", content: "Adoraria! Que tal no sábado à tarde?" },
    { sender: "Alice", content: "Perfeito! Conhece algum lugar agradável para nos encontrarmos?" },
    { sender: "Você", content: "Que tal no Café Central? É perto do parque e tem um ambiente bem aconchegante." },
    { sender: "Alice", content: "Ótima ideia! Nos vemos lá às 15h então." },
    { sender: "Você", content: "Combinado! Até sábado, Alice." },
    { sender: "Alice", content: "Até sábado! 😊" }
  ],
  12: [
    { sender: "Bob", content: "Vamos nos encontrar amanhã?" },
    { sender: "Você", content: "Claro, que horas?" },
  ],
  13: [
    { sender: "Charlie", content: "Enviei os documentos." },
    { sender: "Você", content: "Recebi, obrigado!" },
  ]
};


export function Chat() {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(
    conversations[0]
  );
  const [messages, setMessages] = useState<Message[]>(
    mockMessages[selectedConversation.id] || []
  );
  const [newMessage, setNewMessage] = useState<string>("");

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.id] || []);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const updatedMessages: Message[] = [
      ...messages,
      { sender: "Você", content: newMessage },
    ];

    setMessages(updatedMessages);
    setNewMessage("");

    mockMessages[selectedConversation.id] = updatedMessages;
  };

  return (
    <>
      <Helmet title="Bate papo" />
      <div className="grid grid-cols-[1fr_3fr] antialiased">
        <ScrollArea className="h-[calc(100vh-4.05rem)]">
          {conversations.map((conversation) => (
            <ConversationListItem
              conversation={conversation}
              selectedConversation={selectedConversation}
              handleconversationversationSelect={handleConversationSelect}
            />
          ))}
        </ScrollArea>
        <div className="flex-1 flex flex-col border-l">
          <ConversationHeader selectedConversation={selectedConversation} />
          <ScrollArea className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-12.29rem)]">
            {messages.map((msg, i) => (
              <div key={i}
                className={`mb-4 flex ${
                  msg.sender === "Você" ? "justify-end" : "justify-start"
                }`}
              >
                <div className={`max-w-xs rounded-lg px-4 py-2 ${
                  msg.sender === "Você" ? "bg-blue-500 text-white" : "bg-gray-800 text-white" 
                }`}>
                  <p>{msg.content}</p>
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
        </div>
      </div>
    </>
  )
}