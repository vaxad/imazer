"use client";
import useChat from "@/components/providers/chat-provider";
import { X } from "lucide-react";
import React from "react";

export default function Images() {
  const { images, removeImage } = useChat();
  if (!images.length) {
    return null;
  }
  return (
    <div className="grid grid-cols-10 gap-4 mb-4">
      {images.map((image, idx) => (
        <div
          key={idx}
          className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center relative overflow-hidden"
        >
          <img
            src={image.url || "/placeholder.svg"}
            alt={`Uploaded image ${idx + 1}`}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => removeImage(image.id)}
            className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
