import Separator from "../../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import CreateServerPopup from "./ServerDialog";
import { useEffect, useState } from "react";
import { getAllServerDetails } from "@/lib/retrieveserver";
import ServerDialog from "./ServerDialog";

interface ServerListProps {
  userData: any;
  setSelectedServer: (server: any | null) => void;
  onServerUpdated: () => void;
  servers: any;
}

const ServerList = ({
  userData,
  setSelectedServer,
  onServerUpdated,
  servers,
}: ServerListProps) => {
  return (
    <div className="flex flex-col  bg-primary p-2 gap-2 overflow-auto no-scrollbar">
      <div className="" onClick={() => setSelectedServer("DM")}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="hover:cursor-pointer"
                onClick={() => setSelectedServer("DM")}
              >
                <Avatar>
                  <AvatarImage src="/images/PHiscordLogo.png" alt="@shadcn" />
                  <AvatarFallback>PH</AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent>Direct Message</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Separator />
      {servers.map((server, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="hover:cursor-pointer"
                onClick={() => setSelectedServer(server.id)}
              >
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  {/* <AvatarFallback>{server?.charAt(0)}</AvatarFallback> */}
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent>{server?.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      <ServerDialog user={userData} onServerUpdated={onServerUpdated} />
    </div>
  );
};

export default ServerList;
