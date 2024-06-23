import React from "react";
import Avatar from "../ui/avatar";

const DirectMessages = () => {
  const messages = [
    { name: "torpadeka", status: "online" },
    { name: "! Shrei", status: "offline" },
    { name: "farreltest1", status: "online" },
    { name: "SUNSHINE69", status: "offline" },
    { name: "Koya", status: "online" },
    { name: "Discord", status: "official" },
    { name: "Rayerz", status: "offline" },
  ];

  return (
    <div className="flex flex-col space-y-2 p-2">
      {messages.map((message, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Avatar
            src="https://via.placeholder.com/40"
            alt={message.name}
            fallback={message.name.charAt(0)}
          />
          <span className="text-white">{message.name}</span>
        </div>
      ))}
    </div>
  );
};

export default DirectMessages;
