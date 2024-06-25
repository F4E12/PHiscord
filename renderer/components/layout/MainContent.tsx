import { ReactNode, useEffect, useState } from "react";
import InfoSection from "@/components/layout/InfoSection";
import ChatSection from "@/components/layout/ChatSection";
import { getServerDetails } from "@/lib/retrieveserver";

interface ServerContentProps {
  userData: any;
  onProfileUpdate: (newData: any) => void;
  onImageChange: (newImageURL: string) => void;
  server: any;
}

const MainContent = ({
  userData,
  onProfileUpdate,
  onImageChange,
  server,
}: ServerContentProps) => {
  return (
    <div className="flex flex-grow">
      <div className="w-64 bg-secondary">
        {/* {server} */}
        <InfoSection
          userData={userData}
          onProfileUpdate={onProfileUpdate}
          onImageChange={onImageChange}
          selectedServer={server}
        />
      </div>
      <div className="flex-grow bg-primary p-2">
        <ChatSection server={server} />
      </div>
    </div>
  );
};

export default MainContent;
