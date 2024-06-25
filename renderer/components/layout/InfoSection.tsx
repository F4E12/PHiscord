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
}

const InfoSection = ({
  userData,
  onProfileUpdate,
  onImageChange,
  selectedServer = "DM",
}: InfoSectionProps) => {
  console.log(selectedServer);
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
