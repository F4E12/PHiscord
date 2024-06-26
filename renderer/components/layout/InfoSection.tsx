// components/InfoSection.tsx
import React, { useEffect, useState } from "react";
import DirectMessages from "./DirectMessages";
import ServerInformation from "./ServerInformation";
import UserInformation from "./UserInformation";
import { getServerDetails } from "@/lib/retrieveserver";

interface InfoSectionProps {
  userData: any;
  onProfileUpdate: (newData: any) => void;
  onImageChange: (newImageURL: string) => void;
  selectedServer: any;
  selectedChannel: any;
  setSelectedChannel: (channel: any) => void;
  setSelectedFriend: (friend: any) => void;
  members: any;
}

const InfoSection = ({
  userData,
  onProfileUpdate,
  onImageChange,
  selectedServer,
  selectedChannel,
  setSelectedChannel,
  setSelectedFriend,
  members,
}: InfoSectionProps) => {
  return (
    <div className="flex flex-col h-full bg-secondary">
      <div className="flex-grow overflow-auto">
        {selectedServer === "DM" ? (
          <DirectMessages setSelectedFriend={setSelectedFriend} />
        ) : (
          <ServerInformation
            selectedServer={selectedServer}
            selectedChannel={selectedChannel}
            setSelectedChannel={setSelectedChannel}
            members={members}
          />
        )}
      </div>
      <div className="">
        <UserInformation
          userData={userData}
          onProfileUpdate={onProfileUpdate}
          onImageChange={onImageChange}
        />
      </div>
    </div>
  );
};

export default InfoSection;
