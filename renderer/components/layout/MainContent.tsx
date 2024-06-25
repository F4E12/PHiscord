import { ReactNode } from "react";
import InfoSection from "@/components/layout/InfoSection";
import ChatSection from "@/components/layout/ChatSection";

interface ServerContentProps {
  userData: any;
  onProfileUpdate: (newData: any) => void;
  onImageChange: (newImageURL: string) => void;
  server: string | null;
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
        <ChatSection />
      </div>
    </div>
  );
};

export default MainContent;
