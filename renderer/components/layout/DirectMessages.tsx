import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DirectMessageProps {
  setSelectedFriend: (friend: any | null) => void;
}

const DirectMessages = ({ setSelectedFriend }: DirectMessageProps) => {
  const messages = [
    { name: "torpadeka", status: "online" },
    { name: "! Shrei", status: "offline" },
    { name: "farreltest1", status: "online" },
    { name: "SUNSHINE69", status: "offline" },
    { name: "Koya", status: "online" },
    { name: "Discord", status: "official" },
    { name: "Rayerz", status: "offline" },
    { name: "Rayerz", status: "offline" },
    { name: "Rayerz", status: "offline" },
    { name: "Rayerz", status: "offline" },
    { name: "Rayerz", status: "offline" },
    { name: "Rayerz", status: "offline" },
    { name: "Rayerz", status: "offline" },
  ];

  return (
    <div className="flex flex-col space-y-2 p-2">
      {messages.map((message, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 hover:cursor-pointer hover:bg-background p-1 rounded"
          onClick={() => setSelectedFriend(message.name)}
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-white">{message.name}</span>
        </div>
      ))}
    </div>
  );
};

export default DirectMessages;
