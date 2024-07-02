import { useState } from "react";
import Roles from "./Roles";
import { signOutUser } from "@/lib/authentication";
import SideBar from "./SideBar";
import InvitePopup from "./InvitePopup";
import GeneralSettings from "./ServerGeneralSetting";

interface ServerSettingProps {
  serverId: any;
  members: any;
}
export const ServerSetting = ({ serverId, members }: ServerSettingProps) => {
  const [selectedSetting, setSelectedSetting] = useState("general");
  return (
    <div className="bg-primary absolute top-0 left-0 w-full h-full flex flex-row z-10">
      <SideBar setSelectedSetting={setSelectedSetting} serverId={serverId} />
      {selectedSetting === "roles" ? (
        <Roles serverId={serverId} members={members} />
      ) : null}
      {selectedSetting === "general" ? (
        <GeneralSettings serverId={serverId} />
      ) : null}
    </div>
  );
};

export default ServerSetting;
