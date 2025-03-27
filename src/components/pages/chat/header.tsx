import { ModeToggle } from "@/components/ux/mode-toggle";
import React from "react";

export default function Header() {
  return (
    <div className="flex w-full justify-between items-center h-fit pt-2 pb-12 fixed top-0 z-10 bg-gradient-to-b from-background to-transparent container mx-autoz-[9999] isolate | before:absolute before:inset-0 before:-z-10 before:backdrop-blur-sm before:[mask-image:linear-gradient(black_25%,transparent)]">
      <h1 className="font-extrabold italic">imazer.</h1>
      <div className="flex gap-4">
        <ModeToggle />
      </div>
    </div>
  );
}
