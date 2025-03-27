"use client";
import Images from "@/components/pages/chat/images";
import useChat from "@/components/providers/chat-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Send } from "lucide-react";
import React from "react";

export default function InputSection() {
  const {
    handleSubmit,
    question,
    handleInputChange,
    isSubmitDisabled,
    addImage,
    isImageInputDisabled,
  } = useChat();
  return (
    <form onSubmit={handleSubmit} className="mb-4 mt-2 h-fit px-4">
      <Images />
      <div className="flex gap-2">
        <Input
          value={question}
          onChange={handleInputChange}
          placeholder="Ask a question about these images..."
          className="flex-1"
        />
        <label
          htmlFor="file-input"
          role="button"
          className={buttonVariants({ size: "icon", variant: "outline" })}
        >
          <Plus />
          <input
            type="file"
            accept="image/*"
            disabled={isImageInputDisabled}
            onChange={addImage}
            multiple
            className="hidden"
            id="file-input"
          />
        </label>
        <Button type="submit" disabled={isSubmitDisabled}>
          <Send />
        </Button>
      </div>
    </form>
  );
}
