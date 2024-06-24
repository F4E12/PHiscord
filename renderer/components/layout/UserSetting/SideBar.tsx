import Icon from "@/components/ui/icon";
import { CogIcon, EyeIcon, ShieldCheckIcon } from "@heroicons/react/solid";
import { useState } from "react";

interface GeneralSettingProps {
  setSelectedSetting: (setting: string) => void;
}

export const SideBar = ({ setSelectedSetting }: GeneralSettingProps) => {
  return (
    <div className="w-1/4 h-full bg-gray-800 text-white flex flex-col p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>
      <div className="space-y-4">
        <div
          className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
          onClick={() => setSelectedSetting("general")}
        >
          <Icon type="setting"></Icon>
          <span>General Settings</span>
        </div>
        <div
          className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
          onClick={() => setSelectedSetting("appearance")}
        >
          <Icon type="brush"></Icon>
          <span>Appearance Settings</span>
        </div>
        <div
          className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
          onClick={() => setSelectedSetting("overlay")}
        >
          <Icon type="eye"></Icon>
          <span>Overlay Settings</span>
        </div>
        <div
          className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
          onClick={() => setSelectedSetting("privacy")}
        >
          <Icon type="shield"></Icon>
          <span>Privacy Settings</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
