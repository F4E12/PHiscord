import { useState } from "react";
import ServerSetting from "./ServerSetting/ServerSetting";
import Icon from "../ui/icon";
import ServerMember from "./ServerMember";

interface ServerHeaderProps {
  serverName: string;
  serverID: string;
  members: any;
}

function ServerHeader({ serverName, serverID, members }: ServerHeaderProps) {
  const [isOpenSetting, setisOpenSetting] = useState<boolean>(false);
  const [isOpenMemberList, setisOpenMemberList] = useState<boolean>(false);
  const toggleSetting = () => {
    setisOpenSetting(!isOpenSetting);
  };
  const toggleMember = () => {
    setisOpenMemberList(!isOpenMemberList);
  };
  return (
    <>
      {isOpenSetting && <ServerSetting serverName={serverID} />}
      {isOpenSetting && (
        <button
          className="absolute right-0 top-0"
          onClick={() => toggleSetting()}
        >
          ✕
        </button>
      )}
      <div className="absolute right-0">
        {isOpenMemberList && <ServerMember members={members} />}
      </div>
      <div className="p-2 border-b-2 border-[#202124] flex justify-between items-center">
        {serverName}
        <div className="flex gap-2">
          <div className="" onClick={toggleMember}>
            <Icon type="member"></Icon>
          </div>
          <div className="" onClick={toggleSetting}>
            <Icon type="setting"></Icon>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServerHeader;
