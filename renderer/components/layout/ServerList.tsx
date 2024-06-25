import Separator from "../../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import CreateServerPopup from "./CreateServerPopup";

interface ServerListProps {
  userData: any;
  servers: any[];
  setSelectedServer: (server: any | null) => void;
}

const ServerList = ({
  userData,
  servers,
  setSelectedServer,
}: ServerListProps) => {
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
        <div className="" onClick={() => setSelectedServer(server.id)}>
          <Avatar key={index}>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            {/* <AvatarFallback>{server?.charAt(0)}</AvatarFallback> */}
          </Avatar>
        </div>
      ))}
      <CreateServerPopup user={userData} />
    </div>
  );
};

export default ServerList;
