"use client";
import { ImageDialog } from "@/components/pages/chat/image-dialog";
import useChat from "@/components/providers/chat-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { capitalize } from "@/lib/helpers/string";
import { ERole, TAiMessage, TMessage, TUserMessage } from "@/lib/types/chat";
import { cn } from "@/lib/utils";
import React, { useCallback } from "react";

function UserMessage({ message }: { message: TUserMessage }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="p-2 rounded text-foreground bg-foreground/20 max-w-3/4">
        {message.text}
      </div>
      <div className="flex gap-2">
        {message.images.map((image, idx) => (
          <div key={idx} className="size-6 flex rounded overflow-clip">
            <img
              src={image.url}
              alt={`Uploaded image ${idx + 1}`}
              className="object-cover size-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function BotMessage({
  message,
  userMessage,
}: {
  message: TAiMessage;
  userMessage: TUserMessage;
}) {
  const getImage = useCallback(
    (imageId: string) => {
      return (
        userMessage.images.find((image) => image.id === imageId)?.url || ""
      );
    },
    [userMessage],
  );
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  return (
    <div className="flex justify-start max-w-3/4">
      <div className="flex flex-col gap-2">
        {message.answers.map((answer, idx) => (
          <div
            onClick={() => setSelectedIdx(idx)}
            key={idx}
            className={cn(
              "grid grid-cols-[auto_1fr] gap-2 transition-all rounded cursor-pointer p-2",
              { "bg-foreground/5": selectedIdx === idx },
            )}
          >
            <ImageDialog url={getImage(answer.id)}>
              <div className="relative group size-24">
                <div className="absolute text-center flex justify-center items-center inset-0 bg-black/50 group-hover:opacity-100 opacity-0 transition-opacity duration-200">
                  <h3 className="text-xs">View Image</h3>
                </div>
                <img
                  className="size-full rounded aspect-square border"
                  src={getImage(answer.id)}
                  alt=""
                />
              </div>
            </ImageDialog>
            <div className="flex flex-wrap h-fit">
              {answer.chunks
                .slice(0, selectedIdx === idx ? Infinity : 40)
                .map((chunk, idx) => (
                  <span
                    key={idx}
                    className="text-foreground fade-in animate-in pl-1"
                  >
                    {idx === 0 ? capitalize(chunk) : chunk + " "}
                  </span>
                ))}
              {selectedIdx !== idx && "..."}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Message({
  message,
  prevMessage,
}: {
  message: TMessage;
  prevMessage?: TMessage;
}) {
  if (message.role === ERole.User) {
    return <UserMessage message={message} />;
  }

  return (
    <BotMessage message={message} userMessage={prevMessage as TUserMessage} />
  );
}

export default function Messages() {
  const { messages } = useChat();
  return (
    <ScrollArea className="h-full overflow-y-auto">
      <div className="h-full flex flex-col gap-4 px-4 pt-32">
        {messages.map((message, idx) => (
          <Message
            key={idx}
            message={message}
            prevMessage={messages[idx - 1]}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
