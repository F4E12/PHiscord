import { useState } from "react";
import Icon from "../ui/icon";
import { UserSetting } from "./UserSetting/UserSetting";

function UserInformation() {
  const [mute, setMute] = useState(false);
  const [deafen, setDeafen] = useState(false);
  const [setting, setSetting] = useState(false);
  const toogleMute = () => {
    setMute(!mute);
  };
  const toogleDeafen = () => {
    setDeafen(!deafen);
  };
  const toogleSetting = () => {
    setSetting(!setting);
  };
  return (
    <div className="w-64 flex items-center justify-between p-2 bg-gray-900 rounded-md max-w-sm bottom-0">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <img
            src="/images/loginbg.svg"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-white text-sm font-semibold">IWasf4e12</span>
          <span className="text-gray-400 text-xs">:D</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="" onClick={() => toogleMute()}>
          {mute || deafen ? (
            <Icon type="not-mic"></Icon>
          ) : (
            <Icon type="mic"></Icon>
          )}
        </button>
        <button className="" onClick={() => toogleDeafen()}>
          {deafen ? (
            <Icon type="not-headphone"></Icon>
          ) : (
            <Icon type="headphone"></Icon>
          )}
        </button>
        <button className="" onClick={() => toogleSetting()}>
          <Icon type="setting"></Icon>
        </button>
        {setting && <UserSetting />}
        {setting && (
          <button
            className="absolute right-0 top-0"
            onClick={() => toogleSetting()}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default UserInformation;
