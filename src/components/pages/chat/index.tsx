import Header from "@/components/pages/chat/header";
import InputSection from "@/components/pages/chat/input";
import Messages from "@/components/pages/chat/messages";
import React from "react";

export default function ChatPage() {
  return (
    <div className="h-svh grid grid-rows-[1fr_auto]">
      <Header />
      <Messages />
      <InputSection />
    </div>
  );
}
