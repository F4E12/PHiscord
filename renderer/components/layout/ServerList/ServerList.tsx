import Separator from "../../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  TooltipServer,
  TooltipServerContent,
  TooltipServerProvider,
  TooltipServerTrigger,
} from "@/components/ui/tooltipserver";

import CreateServerPopup from "./ServerDialog";
import { useEffect, useState } from "react";
import { getAllServerDetails } from "@/lib/retrieveserver";
import ServerDialog from "./ServerDialog";

interface ServerListProps {
  userData: any;
  setSelectedServer: (server: any | null) => void;
  // onServerUpdated: () => void;
  servers: any;
}

const ServerList = ({
  userData,
  setSelectedServer,
  // onServerUpdated,
  servers,
}: ServerListProps) => {
  return (
    <div className="flex flex-col  bg-primary p-2 gap-2 overflow-auto no-scrollbar">
      <div className="" onClick={() => setSelectedServer("DM")}>
        <TooltipServerProvider>
          <TooltipServer>
            <TooltipServerTrigger asChild>
              <div
                className="hover:cursor-pointer"
                onClick={() => setSelectedServer("DM")}
              >
                <Avatar>
                  <AvatarImage src="/images/PHiscordLogo.png" alt="@shadcn" />
                  <AvatarFallback>PH</AvatarFallback>
                </Avatar>
              </div>
            </TooltipServerTrigger>
            <TooltipServerContent>Direct Message</TooltipServerContent>
          </TooltipServer>
        </TooltipServerProvider>
      </div>
      <Separator />
      {servers.map((server, index) => (
        <TooltipServerProvider key={index}>
          <TooltipServer>
            <TooltipServerTrigger asChild>
              <div
                className="hover:cursor-pointer"
                onClick={() => setSelectedServer(server.id)}
              >
                <Avatar>
                  <AvatarImage src={server.profilePicture} alt="@shadcn" />
                  <AvatarFallback>{server?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </TooltipServerTrigger>
            <TooltipServerContent>{server?.name}</TooltipServerContent>
          </TooltipServer>
        </TooltipServerProvider>
      ))}
      <ServerDialog
        user={userData}
        // onServerUpdated={onServerUpdated}
      />
    </div>
  );
};

export default ServerList;
