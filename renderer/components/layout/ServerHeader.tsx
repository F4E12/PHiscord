import { useState } from "react";
import ServerSetting from "./ServerSetting/ServerSetting";
import Icon from "../ui/icon";

interface ServerHeaderProps {
  serverName: string;
}

function ServerHeader({ serverName }: ServerHeaderProps) {
  const toggleSetting = () => {
    setIsOpen(!isOpen);
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      {isOpen && <ServerSetting />}
      {isOpen && (
        <button
          className="absolute right-0 top-0"
          onClick={() => toggleSetting()}
        >
          ✕
        </button>
      )}
      <div className="p-2 border-b-2 border-[#202124] flex justify-between items-center">
        {serverName}
        <div className="" onClick={toggleSetting}>
          <Icon type="setting"></Icon>
        </div>
      </div>
    </>
  );
}

export default ServerHeader;
