import { useState } from "react";
import Avatar from "../../components/ui/avatar";
import Separator from "../../components/ui/separator";

interface ServerListProps {
  setSelectedServer: (server: string | null) => void;
}

const ServerList = ({ setSelectedServer }: ServerListProps) => {
  const servers = ["Server 1", "Server 2", "Server 3"];
  return (
    <div className="flex flex-col  bg-primary p-2 gap-2 overflow-auto no-scrollbar">
      <div className="" onClick={() => setSelectedServer("DM")}>
        <Avatar src="/images/PHiscordLogo.png" />
      </div>
      <Separator />
      {servers.map((server, index) => (
        <div className="" onClick={() => setSelectedServer(server)}>
          <Avatar key={index} src="https://github.com/shadcn.png" />
        </div>
      ))}
    </div>
  );
};

export default ServerList;
