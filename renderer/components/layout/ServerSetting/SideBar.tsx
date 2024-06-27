import Icon from "@/components/ui/icon";
import { CogIcon, EyeIcon, ShieldCheckIcon } from "@heroicons/react/solid";
import { useState } from "react";
import InvitePopup from "./InvitePopup";

interface GeneralSettingProps {
  setSelectedSetting: (setting: string) => void;
  serverId: any;
}

export const SideBar = ({
  setSelectedSetting,
  serverId,
}: GeneralSettingProps) => {
  let joinLink = "phiscord.join/" + serverId;
  return (
    <div className="w-1/4 h-full bg-gray-800 text-white flex flex-col p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>
      <div className="space-y-4">
        <div
          className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
          onClick={() => setSelectedSetting("roles")}
        >
          <span>Roles</span>
        </div>
        <InvitePopup link={joinLink} />
      </div>
    </div>
  );
};

export default SideBar;
