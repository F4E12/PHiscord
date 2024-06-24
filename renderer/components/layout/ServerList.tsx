import { useState } from "react";
import Separator from "../../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ServerListProps {
  setSelectedServer: (server: string | null) => void;
}

const ServerList = ({ setSelectedServer }: ServerListProps) => {
  const servers = ["Server 1", "Server 2", "Server 3"];
  return (
    <div className="flex flex-col  bg-primary p-2 gap-2 overflow-auto no-scrollbar">
      <div className="" onClick={() => setSelectedServer("DM")}>
        <Avatar>
          <AvatarImage src="/images/PHiscordLogo.png" alt="@shadcn" />
          <AvatarFallback>PH</AvatarFallback>
        </Avatar>
      </div>
      <Separator />
      {servers.map((server, index) => (
        <div className="" onClick={() => setSelectedServer(server)}>
          <Avatar key={index}>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>{server.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      ))}
    </div>
  );
};

export default ServerList;
