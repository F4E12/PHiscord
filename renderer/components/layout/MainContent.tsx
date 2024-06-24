import { ReactNode } from "react";
import InfoSection from "@/components/layout/InfoSection";
import ChatSection from "@/components/layout/ChatSection";

interface ServerContentProps {
  server: string | null;
}

const MainContent = ({ server = "DM" }: ServerContentProps) => {
  return (
    <div className="flex flex-grow">
      <div className="w-64 bg-secondary">
        {/* {server} */}
        <InfoSection selectedServer={server} />
      </div>
      <div className="flex-grow bg-primary p-2">
        <ChatSection />
      </div>
    </div>
  );
};

export default MainContent;
