import { ReactNode } from "react";
import InfoSection from "@/components/layout/InfoSection";
import ChatSection from "@/components/layout/ChatSection";

interface Props {
  children: ReactNode;
}

const MainContent = ({ children }: Props) => {
  return (
    <div className="flex flex-grow bg-gray-700">
      <div className="w-64 bg-gray-900 p-2">
        <InfoSection />
      </div>
      <div className="flex-grow bg-gray-800 p-2">
        <ChatSection />
      </div>
    </div>
  );
};

export default MainContent;
