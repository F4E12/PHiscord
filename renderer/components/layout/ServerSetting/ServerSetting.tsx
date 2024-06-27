import { useState } from "react";
import Roles from "./Roles";
import { signOutUser } from "@/lib/authentication";
import SideBar from "./SideBar";
import InvitePopup from "./InvitePopup";

interface ServerSettingProps {
  serverName: any;
}
export const ServerSetting = ({ serverName }: ServerSettingProps) => {
  const [selectedSetting, setSelectedSetting] = useState("general");
  let joinLink = "phiscord.join/" + serverName;
  return (
    <div className="bg-primary absolute top-0 left-0 w-full h-full flex flex-row z-10">
      <SideBar setSelectedSetting={setSelectedSetting} serverId={serverName} />
      {selectedSetting === "roles" ? <Roles /> : null}
    </div>
  );
};

export default ServerSetting;
