import { useState } from "react";
import Separator from "../../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import CreateServerPopup from "./CreateServerPopup";

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
      <CreateServerPopup />
    </div>
  );
};

export default ServerList;
