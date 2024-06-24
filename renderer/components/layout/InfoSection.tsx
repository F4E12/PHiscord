// components/InfoSection.tsx
import React, { useState } from "react";
import DirectMessages from "./DirectMessages";
import ServerInformation from "./ServerInformation";
import UserInformation from "./UserInformation";

interface InfoSectionProps {
  selectedServer: string | null;
}

const InfoSection = ({ selectedServer }: InfoSectionProps) => {
  return (
    <div className="flex flex-col bg-secondary">
      <div className="flex-grow">
        {selectedServer === "DM" ? (
          <DirectMessages />
        ) : (
          <ServerInformation selectedServer={selectedServer} />
        )}
      </div>
      <UserInformation></UserInformation>
    </div>
  );
};

export default InfoSection;
