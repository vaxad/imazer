import ChatPage from "@/components/pages/chat";
import { ChatProvider } from "@/components/providers/chat-provider";

export default function Home() {
  return (
    <ChatProvider>
      <ChatPage />
    </ChatProvider>
  );
}
