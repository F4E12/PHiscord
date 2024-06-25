// components/InfoSection.tsx
import React, { useState } from "react";
import DirectMessages from "./DirectMessages";
import ServerInformation from "./ServerInformation";
import UserInformation from "./UserInformation";

interface InfoSectionProps {
  userData: any;
  onProfileUpdate: (newData: any) => void;
  onImageChange: (newImageURL: string) => void;
  selectedServer: string;
}

const InfoSection = ({
  userData,
  onProfileUpdate,
  onImageChange,
  selectedServer = "DM",
}: InfoSectionProps) => {
  return (
    <div className="flex flex-col h-full bg-secondary">
      <div className="flex-grow overflow-auto">
        {selectedServer}
        {selectedServer === "DM" ? (
          <DirectMessages />
        ) : (
          <ServerInformation selectedServer={selectedServer} />
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
