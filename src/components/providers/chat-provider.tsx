"use client";
import { LOREM_ARRAY } from "@/lib/constants/dummy";
import { ERole, TImage, TMessage } from "@/lib/types/chat";
import { ProviderProps } from "@/lib/types/common";
import React, { createContext, useContext, useMemo, useState } from "react";

export async function processImageWithAIDummy(
  imageFile: File,
  question: string,
): Promise<AsyncIterable<string>> {
  const words = [imageFile.name, ...LOREM_ARRAY, question.split(" ")];

  function getRandomWords(count: number): string {
    return Array.from(
      { length: count },
      () => words[Math.floor(Math.random() * words.length)],
    ).join(" ");
  }

  async function* generateDummyStream() {
    const count = Math.min(30, Math.max(60, Math.random() * 60));
    for (let i = 0; i < count; i++) {
      yield getRandomWords(Math.floor(Math.random() * 5) + 3) + ".";
      await new Promise((resolve) => setTimeout(resolve, 700 * Math.random()));
    }
  }

  return generateDummyStream();
}

function useChatUtil() {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [images, setImages] = useState<TImage[]>([]);
  const [question, setQuestion] = useState("");

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || images.length >= 4) return;

    const files = Array.from(e.target.files).slice(0, 4 - images.length);

    files.forEach((file) => {
      const newImage = {
        id: Math.random().toString(36).substring(2, 9),
        file,
        url: URL.createObjectURL(file),
      };

      setImages((prev) => [...prev, newImage]);
    });
    e.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };
  function addMessage(message: TMessage) {
    setMessages((prev) => [...prev, message]);
  }

  function updateMessage(message: Partial<TMessage>, idx: number) {
    setMessages((prev) => {
      const newMessages = [...prev];
      newMessages[idx] = { ...newMessages[idx], ...message } as TMessage;
      return newMessages;
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuestion(e.target.value);
  }

  async function sendRequest(idx: number, images: TImage[], question: string) {
    await Promise.all(
      images.map(async (image) => {
        const stream = await processImageWithAIDummy(image.file, question);

        let answer = "";
        for await (const chunk of stream) {
          answer += chunk + " ";
          setMessages((prev) => {
            const newMessages = [...prev];
            console.log({ idx, newMessages, m: newMessages[idx] });
            if (newMessages[idx]?.role !== ERole.AI) return newMessages;
            const newAnswers = [...newMessages[idx].answers];
            const prevAnswer = newAnswers.find((a) => a.id === image.id);
            if (!prevAnswer) return newMessages;
            newAnswers[newAnswers.indexOf(prevAnswer)] = {
              ...prevAnswer,
              chunks: [...prevAnswer.chunks, ...chunk.split(" ")],
            };
            newMessages[idx] = { ...newMessages[idx], answers: newAnswers };
            return newMessages;
          });
        }
        console.log({ answer });
      }),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (images.length === 0 || !question) return;

    console.log("Images:", images);
    console.log("Question:", question);
    addMessage({
      role: ERole.User,
      images: images,
      text: question,
    });

    addMessage({
      role: ERole.AI,
      answers: images.map((image) => ({
        id: image.id,
        chunks: [],
      })),
    });
    setImages([]);
    setQuestion("");
    void sendRequest(messages.length + 1, images, question);
  }

  const isSubmitDisabled = useMemo(
    () => !images.length || !question,
    [images, question],
  );

  const isImageInputDisabled = useMemo(() => images.length >= 4, [images]);

  return {
    messages,
    addMessage,
    updateMessage,
    removeImage,
    addImage,
    question,
    images,
    handleInputChange,
    handleSubmit,
    isImageInputDisabled,
    isSubmitDisabled,
  };
}

const ChatContext = createContext<ReturnType<typeof useChatUtil> | null>(null);

export function ChatProvider({ children }: ProviderProps) {
  const chat = useChatUtil();
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}

export default function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
