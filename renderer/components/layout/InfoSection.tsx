// components/InfoSection.tsx
import React, { useState } from "react";
import DirectMessages from "./DirectMessages";
import ServerInformation from "./ServerInformation";

const InfoSection = () => {
  const [view, setView] = useState<"directMessages" | "serverInfo">(
    "directMessages"
  );

  return (
    <div className="flex flex-col w-64 bg-gray-900">
      <div className="flex justify-between p-2">
        <button
          onClick={() => setView("directMessages")}
          className="text-white"
        >
          DM
        </button>
        <button onClick={() => setView("serverInfo")} className="text-white">
          Server
        </button>
      </div>
      <div className="flex-grow">
        {view === "directMessages" ? <DirectMessages /> : <ServerInformation />}
      </div>
    </div>
  );
};

export default InfoSection;
